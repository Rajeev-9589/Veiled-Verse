export const getFeaturedStories = (stories) =>
    stories.filter((story) => story.isFeatured);
  
  export const getPaidStories = (stories) =>
    stories.filter((story) => story.isPaid);
  
  export const getFreeStories = (stories) =>
    stories.filter((story) => !story.isPaid);
  