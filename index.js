import reddit from './redditApi';

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
reddit.search(searchTerm);

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