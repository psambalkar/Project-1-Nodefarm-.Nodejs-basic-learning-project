const fs=require('fs');
const http=require('http');   //building http server
const url=require('url');
const replaceTemplate=require('./modules/replacetemplate');
const slugify=require('slugify');                        //last part of url  after product?id=0 here ?id=0 we use string 
////////FILES

//blocking ,synchronous way
// const textIn=fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);
// const textOut =`this is what we know abot the avocoda :${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textOut);
// console.log('file written');
//nonblocking async way;
// fs.readFile('./txt/start.txt','utf-8',(err,data1)=>{
//     console.log(data1);
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
//     console.log(data2);
//     fs.writeFile('./txt/final.txt',`${data1}\n${data2}`,(err)=>{  //writefile only takes err as arg in callback
//         console.log('your file is been wrutten');
//     })
//     });
// });
// console.log('thamba jara');

const tempoverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard=fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct=fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj=JSON.parse(data);                                          //converts text to javascript obj
const slugs=dataObj.map(el=>slugify(el.productName,{lower:true}));
console.log(slugs);
const server=http.createServer((req,res)=>{
           const pathName=req.url;  //reads the url from the req
        //    console.log(url.parse(pathName,true)); this is will give query and pathname object
           ///OVERVIEW PAGE
           const {query,pathname}=url.parse(req.url,true);
           if(pathname ==='/'|| pathname ==='/overview'){
           res.writeHead(200,{ 
               'Content-type':"text/html"
           });
           const cardsHtml=dataObj.map(el=>replaceTemplate(tempCard,el)).join('');
           const output=tempoverview.replace(/{%PRODUCT_CARD%}/g,cardsHtml);
           res.end(output);
           }
           ////PRODUCT PAGE
           
           else if(pathname==='/product'){
            res.writeHead(200,{ 
                'Content-type':"text/html"
            });
               const product=dataObj[query.id];
               const output=replaceTemplate(tempProduct,product);

               res.end(output);
           }
           
           ///API
           
           else if(pathname==='/api'){
              
                   res.writeHead(200,{
                       'Content-type':'application/json'
                   });
                 res.end(data);      
           }
           else{
               res.writeHead(404,{
                   'Content-type':'text/html',
                   'my-own-header':'hello-world'
               });
               res.end('<h1>this page cannot be found</h1>');
           }
});
server.listen(8000,'127.0.0.1',()=>{
    console.log('server has been started listening to req on port 8000');
})
