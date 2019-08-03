const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

searchForm.addEventListener('submit', e =>{
    // Get search term
    const searchTerm = searchInput.value;
    //Get sort
    const sortBy = document.querySelector('input[name="sortby"]:clicked').value;
    e.preventDefault();
})