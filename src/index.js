const expres = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const ContactRoute = require("./routes/Contact_route/contact.routes");
const { connect } = require("./config/db.config");
const jobRoute = require("./routes/Jobs_route/jobs_route");
const careerRoute = require("./routes/career_route/career_route");
const article_route = require("./routes/article_route/article_route");
const Login_route = require("./routes/Login_route/login_route");
const Recent_login_Route = require("./routes/Recent_login_route/Recent_login_route");
const TestimonialRoute = require("./routes/Testimonial_route/Testimonial_route");
const BannerRoute = require("./routes/Banner_route/banner_route");
const Chatbotroute = require("./routes/Chatbot_route/Chatbot_route");
const Newblogpost = require("./routes/NewBlog_route/NewBlog_route");
const Comment = require("./routes/Comment_route/Comment_route");
const Author = require("./routes/Author_route/Author_route");


require('dotenv').config();
const app = expres();
const port = process.env.PORT || 8000
app.use(cors())
app.use(expres.json())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/contact',ContactRoute)
app.use("/Jobs",jobRoute)
app.use("/career",careerRoute)
app.use("/article",article_route)
app.use("/admin",Login_route)
app.use("/recent-logins",Recent_login_Route)
app.use("/Testimonial",TestimonialRoute)
app.use("/Banner",BannerRoute)
app.use("/Chatbot",Chatbotroute)
app.use("/Newblogpost",Newblogpost)
app.use("/comments",Comment)
app.use("/author",Author)



app.get('/',async(req,res)=>{
    res.send('welcome to home page')
})




app.listen(port,async()=>{
    await connect();
    console.log("Connect")
    console.log(`listening on http://localhost:${port}`)
})