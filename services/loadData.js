import axios from 'axios';
import cheerio from 'cheerio';
import Crud from './crud';
const debug = require('debug')('server');

const reptileUrl = "http://www.jianshu.com";

let index = 0; 
let detailSql = 'INSERT INTO article_detail(id , title , name, avatar, content) VALUES(?, ?, ?, ?, ?)';

const getArticleDetail = deatilLinkList => {
    const { id, detailLink } = deatilLinkList[index];
      // 获取文章详情数据
    axios.get(detailLink)
        .then(res => {
            let html = res.data;
            let $ = cheerio.load(html);
            let rootURL = res.config.url;
            
            let prefix = 'https:';

            let title = $('.post .title').text();
            let authorHtml = $('.post .author');
            let avatarUrl = authorHtml.find('.avatar img').attr('src');
            let infoHtml = authorHtml.find('.info');
            let name = infoHtml.find('.name a').text();  
            let content = $('.article').find('.show-content').html();

            let articleDetail = {
                id: Number(id),
                title,
                name,
                avatar: prefix + avatarUrl,
                // content
            }

            let detailSql = 'INSERT INTO article_detail(id , title , name, avatar) VALUES(?, ?, ?, ?)';

            Crud.insesrt(detailSql, Object.values(articleDetail))
                .then(res => {
                    index++;
                    if(deatilLinkList.length > index) {
                        getArticleDetail(detailSql, deatilLinkList);
                    }
                })
        });
}


let dataIndex = 0;
let insertSql = 'INSERT INTO article_list(id, title, content, thumbnail, nickname, like_num, comment, money) VALUES( ?, ?, ?, ?, ?, ?, ?, ?)';
const insertData = (insertSql, paramList) => {
    Crud.insesrt(insertSql, Object.values(paramList[dataIndex]))
        .then(res => {
            dataIndex++;
            if(paramList.length > dataIndex) {
                insertData(insertSql, paramList);
            }
        });
}


const getArticleList = () => {
    axios.get(reptileUrl)
        .then(res => {
            let html = res.data;
            let $ = cheerio.load(html);
            let rootURL = res.config.url;

            let articleList = [];
            let deatilLinkList = [];

            let atrticleHtml = $('#list-container li');

            atrticleHtml.each(function(index, item) {
                let id = $(this).data('note-id');
                let thumbnail = $(this).find('img').attr('src');
                let detailLink = $(this).find('a').attr('href');
                let mate = $(this).find('.meta');

                let nickname = mate.find('.nickname').text();
                let like_num = mate.find('.ic-list-like').parent().text();
                let comment = mate.find('.ic-list-comments').parent().text();
                let money = mate.find('.ic-list-money').parent().text();
                let title = $(this).find('.content .title').text();
                let content = $(this).find('.content .abstract').text();
            
                let prefix = 'https:';
                let articleItem = {
                    id,
                    title,
                    content,
                    thumbnail: thumbnail ? prefix + thumbnail : '',
                    nickname,
                    like_num: Number(like_num),
                    comment: Number(comment),
                    money: Number(money)
                };

                articleList.push(articleItem);

                if(detailLink.startsWith('/')) {
                    deatilLinkList.push({
                        id,
                        detailLink: rootURL + detailLink
                    });
                } else {
                    deatilLinkList.push({
                        id,
                        detailLink
                    }); 
                }  
            });
    
            // insertData(insertSql, articleList);
             getArticleDetail(deatilLinkList);
        });
}


getArticleList();