export default{
    search: function(searchTerm){
     return fetch(`http://www.reddit.com/search.json?q=${searchTerm}&limit=100&sort=new`)
      .then(res => res.json())
      .then(data => data.data.children.map(data =>
          data.data)) 
      .catch(err => console.log(err))
    }
}