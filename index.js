import reddit from './redditApi';
import TimeAgo from 'javascript-time-ago';
import numeral from 'numeral';
 
// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en'
 
// Add locale-specific relative date/time formatting rules.
TimeAgo.addLocale(en)

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

searchForm.addEventListener('submit', e =>{
    // Get search term
    const searchTerm = searchInput.value;
    //Get sort
    // const sortBy = document.querySelector('input[name="sortby"]:checked').value;
    // console.log(sortBy)
    if(searchTerm === ''){
        showMessage('Please add a search term');
    }
    e.preventDefault();

//Clear input
searchInput.value='';

//Search Reddit
reddit.search(searchTerm)
.then(results => {
    console.log(results);
    let output = '<div class="result">';
    results.forEach(post => {
        const ts = new Date(post.created);
        const timeAgo = new TimeAgo('en-US');
        const date = timeAgo.format(Date.now() - ts ) ;
        const follow = numeral(post.subreddit_subscribers).format('0a');     
        const image = post.preview ? post.preview.images[0].source.url : "https://secure.webtoolhub.com/static/resources/icons/set26/1bc50a8d1fed.png";
        output += `
        <div class="card">
        <div class="card-body">
        <img src="${image}" class="img" alt="...">
          <div class='content'>
          <p class="card-text" id='header'>${truncateText(post.title, 80)}</p>
          <p class="card-text" id='p'>submitted ${date} by <a href = ""> ${post.author_fullname}</a></p>
          <div class="comment-subscribe">
          <button type="button" class="btn btn-light">${post.num_comments} comments</button>
          <button type="button" class="btn btn-light">${follow} subscribers</button>
          </div>
                    
          </div>
          <p id='domain'>
          <button type="button" class="btn btn-light">Readit</button>
           </p>
        </div>
      </div>
        `
    })
    output += '</div>';
    document.getElementById('results').innerHTML = output;
});

})

//show message
function showMessage(message, className){
const div = document.createElement('div');
div.className=`
alert ${className}
`;
div.appendChild(document.createTextNode(message));

const searchContainer = document.getElementById('search-container');

const search = document.getElementById('search');

searchContainer.insertBefore(div, search);

setTimeout(() => document.querySelector('.alert').remove(), 3000)

}


function truncateText(text, limit) {
    const shortened = text.indexOf(' ', limit);
    if(shortened === -1) return text;
    return text.substring(0, shortened);
}