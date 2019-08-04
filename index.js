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
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
width="18" height="18"
viewBox="0 0 172 172"
style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#e74c3c"><g id="surface1"><path d="M86,14.00188c-43.45687,0 -78.87812,30.44937 -78.87812,68.55812c0,22.11813 12.12062,41.37406 30.73156,53.965c-0.02687,0.73906 0.02688,1.935 -0.94062,5.53625c-1.20938,4.44781 -3.64156,10.72313 -8.57313,17.79125l-3.50719,5.02563h6.1275c21.23125,0 33.51313,-13.84063 35.42125,-16.05781c6.31563,1.47812 12.81938,2.29781 19.61875,2.29781c43.45688,0 78.87813,-30.44938 78.87813,-68.55813c0,-38.10875 -35.42125,-68.55812 -78.87813,-68.55812zM86,20.39813c40.48719,0 72.48188,28.03062 72.48188,62.16187c0,34.13125 -31.99469,62.16188 -72.48188,62.16188c-7.01437,0 -13.62562,-0.67188 -19.83375,-2.29781l-1.98875,-0.52406l-1.30344,1.59906c0,0 -9.93031,11.20687 -25.78656,13.90781c2.87563,-5.18688 4.99875,-10.02438 5.97969,-13.67938c1.38406,-5.09281 1.41094,-8.53281 1.41094,-8.53281v-1.76031l-1.47813,-0.94063c-18.1675,-11.55625 -29.48187,-29.44156 -29.48187,-49.93375c0,-34.13125 31.99469,-62.16187 72.48187,-62.16187zM51.6,75.68c-3.80281,0 -6.88,3.07719 -6.88,6.88c0,3.80281 3.07719,6.88 6.88,6.88c3.80281,0 6.88,-3.07719 6.88,-6.88c0,-3.80281 -3.07719,-6.88 -6.88,-6.88zM86,75.68c-3.80281,0 -6.88,3.07719 -6.88,6.88c0,3.80281 3.07719,6.88 6.88,6.88c3.80281,0 6.88,-3.07719 6.88,-6.88c0,-3.80281 -3.07719,-6.88 -6.88,-6.88zM120.4,75.68c-3.80281,0 -6.88,3.07719 -6.88,6.88c0,3.80281 3.07719,6.88 6.88,6.88c3.80281,0 6.88,-3.07719 6.88,-6.88c0,-3.80281 -3.07719,-6.88 -6.88,-6.88z"></path></g></g></g></svg> 
${post.num_comments} comments
   <svg id="subscribe" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
width="18" height="18"
viewBox="0 0 172 172"
style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#e74c3c"><path d="M21.5,21.5c-7.83362,0 -14.33333,6.49972 -14.33333,14.33333v93.16667h14.33333v-93.16667h114.66667v-14.33333zM50.16667,50.16667c-7.90483,0 -14.33333,6.4285 -14.33333,14.33333v71.66667c0,7.90483 6.4285,14.33333 14.33333,14.33333h55.59765l2.09961,-2.09961l5.06706,-5.06706l-5.06706,-5.06706l-2.09961,-2.09961h-55.59765v-52.84017l50.16667,31.34017l50.16667,-31.34017l0.014,22.43782l14.31934,-14.33333v-26.93099c0,-7.90483 -6.4285,-14.33333 -14.33333,-14.33333zM50.16667,64.5h100.33333v4.49316l-50.16667,31.34017l-50.16667,-31.34017zM128.13216,117.99805l-10.13411,10.13411l15.20117,15.20117l-15.20117,15.20117l10.13411,10.13411l15.20117,-15.20117l15.20117,15.20117l10.13411,-10.13411l-15.20117,-15.20117l15.20117,-15.20117l-10.13411,-10.13411l-15.20117,15.20117z"></path></g></g></svg>          
${follow} subscribers
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