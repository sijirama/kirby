import * as Express from "express"
import { EnsureAuth, } from "../middleware/auth"
import StoryModel from "../model/Story"
import UserModel from "../model/User"

const router = Express.Router()

//NOTE: Show Add story page
//NOTE: ROUTE: GET /story/add
router.get("/add" ,EnsureAuth,  (req, res) => {
    res.render("stories/add")
})


//NOTE: Add story 
//NOTE: ROUTE: POST /stories
router.post("/" ,EnsureAuth ,  async (req, res) => {
    try{
        req.body.user = (req as any).user.id
        const story = await StoryModel.create(req.body)
        if(story){
            res.redirect("/dashboard")
        }
    }catch(error){
        console.log(error)
        res.render("error/500")
    }
})

//NOTE: Show public stories 
//NOTE: ROUTE: GET /storie
router.get("/" ,EnsureAuth, async (req, res) => {
    console.log("hitted")
   try {
        const stories = await StoryModel.find({ status:"public" }).populate("user").sort({ createdAt : "desc" }).lean().exec()
        res.render("stories/index",{
            stories
        })
   } catch (error) {
    
   } 
})


//NOTE: get story to edit 
//NOTE: ROUTE: GET /story/add
router.get("/edit/:id" , EnsureAuth, async (req:any, res) => {
    const storyId  = req.params.id
    try {
        const story = await StoryModel.findById({_id:storyId}).lean()
        if(!story) throw new Error("No story found")
        if(story.user != req.user.id){
            res.redirect("dashboard")
        }else{
            res.render("stories/edit" , {
                story
            })
        }
    } catch (error:any) {
       console.log(error.message)
       res.render("error/500")
    }
})


//NOTE: Update story 
//NOTE: ROUTE: GET /story/add
router.put("/:id" ,EnsureAuth, async (req:any, res) => {
    let story = await StoryModel.findById(req.params.id).lean()
    if(!story){
        return res.render("error/404")
    }else{
        if(story.user != req.user.id){
            res.redirect("dashboard")
        }else{
            story = await StoryModel.findOneAndUpdate({_id:req.params.id} , req.body , {
                new:true,
                runValidators:true
            })
        }

        res.redirect("/dashboard")
    }
})

//NOTE: get story to delete 
//NOTE: ROUTE: GET /story/add
router.delete("/:id" , EnsureAuth, async (req:any, res) => {
    const storyId  = req.params.id
    try {
        await StoryModel.deleteOne({_id:storyId})
        res.redirect("/dashboard")
    } catch (error:any) {
       console.log(error.message)
       res.render("error/500")
    }
})





export { router }

