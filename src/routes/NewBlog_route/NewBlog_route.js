const express = require('express');
const router = express.Router();
const BlogPost = require('../../model/NewBlog_model/NewBlog_model');











// Get  all blog posts  category
router.get('/categories', async (req, res) => {
  try {
    const blogPosts = await BlogPost.find({}).select('category -_id');
    const categories = Array.from(new Set(blogPosts.map((post) => post.category)));
    res.json(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ error: 'Error getting categories' });
  }
});


// Get the last three blog posts
router.get('/recent', async (req, res) => {
  try {
    const recentPosts = await BlogPost.find()
      .sort({ created_at: -1 })
      .limit(3)
      .populate('author')
      .populate('comments');

    res.json(recentPosts);
  } catch (error) {
    console.error('Error getting recent blog posts:', error);
    res.status(500).json({ error: 'Error getting recent blog posts' });
  }
});



// Create a new blog post
router.post('/', async (req, res) => {
  const { title, content, author, images, category,maincontent} = req.body;
  if(title, content, author, images, category,maincontent){
  const blogPost = new BlogPost({ title, content, author, images, category,maincontent });
  await blogPost.save();
  res.json(blogPost);
  }else{
res.status(404).json({ error: 'Please provide all required information'})
  }
});


// Get related blog posts
router.get('/related/:id', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    const relatedPosts = await BlogPost.find({ 
      category: blogPost.category, 
      _id: { $ne: blogPost._id } 
    })
    .populate('author')
    .populate('comments')
    .limit(3);

    res.json(relatedPosts);
  } catch (error) {
    console.error('Error getting related blog posts:', error);
    res.status(500).json({ error: 'Error getting related blog posts' });
  }
});






// Get all blog posts
router.get('/:page?', async (req, res) => {
  try {
    const perPage = req.query.perPage ? parseInt(req.query.perPage) : 6; // Define the number of blog posts per page
    const page = req.params.page ? parseInt(req.params.page) : 1; // Current page number - ensure it's a number
    
    // Validate page number
    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: 'Invalid page number' });
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * perPage;

    const blogPosts = await BlogPost.find()
      .populate('author')
      .populate('comments')
      .sort({ created_at: -1 }) // Sort by newest first
      .skip(skip)
      .limit(perPage);

    const totalBlogPosts = await BlogPost.countDocuments(); // Total number of blog posts
    const totalPages = Math.ceil(totalBlogPosts / perPage); // Total number of pages

    res.json({
      blogPosts: blogPosts,
      currentPage: page,
      totalBlogPosts: totalBlogPosts,
      totalPages: totalPages
    });
  } catch (error) {
    console.error('Error getting blog posts:', error);
    res.status(500).json({ error: 'Error getting blog posts' });
  }
});

// Get a single blog post
router.get('/singalepost/:id', async (req, res) => {
  const blogPost = await BlogPost.findById(req.params.id).populate('author').populate('comments');
  if (!blogPost) {
    return res.status(404).json({ error: 'Blog post not found' });
  }
  res.json(blogPost);
});




// Search blog posts by title
router.get('/search/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const blogPosts = await BlogPost.find({ title: new RegExp(title, 'i') })
      .populate('author')
      .populate('comments');
    if (blogPosts.length === 0) {
      return res.status(404).json({ error: 'No blog posts found' });
    }
    res.json(blogPosts);
  } catch (error) {
    console.error('Error searching blog posts:', error);
    res.status(500).json({ error: 'Error searching blog posts' });
  }
});





// Get blog posts by category
router.get('/categorie/:categorie', async (req, res) => {
  const category = req.params.categorie;
  
  try {
    const blogPosts = await BlogPost.find({ category: category }).populate('author').populate('comments');

    if (blogPosts.length === 0) {
      return res.status(404).json({ error: 'No posts found for this category' });
    }

    res.json(blogPosts);
  } catch (error) {
    console.error('Error getting blog posts by category:', error);
    res.status(500).json({ error: 'Error getting blog posts by category' });
  }
});



// Update a blog post
router.put('/:id', async (req, res) => {
  const { title, content, author, images, category } = req.body;

  try {
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { title, content, author, images, category },
      { new: true }
    );

    if (!updatedBlogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(updatedBlogPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Error updating blog post' });
  }
});

// Delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    const deletedBlogPost = await BlogPost.findByIdAndRemove(req.params.id);

    if (!deletedBlogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(deletedBlogPost);
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Error deleting blog post' });
  }
});

module.exports = router;
