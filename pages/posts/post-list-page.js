const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  postsEl = document.getElementById('posts'),
  resultHeading = document.getElementById('result-heading'),
  single_postEl = document.getElementById('single-post');

// Search post and fetch from API
function searchPost(e) {
  e.preventDefault();

  // Clear single post
  single_postEl.innerHTML = '';

  // Get search term
  const term = search.value;

  // Check for empty
  if (term.trim()) {
    fetch(`https://www.thepostdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.posts === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!<p>`;
        } else {
          postsEl.innerHTML = data.posts
            .map(
              post => `
            <div class="post">
              <img src="${post.strpostThumb}" alt="${post.strpost}" />
              <div class="post-info" data-postID="${post.idpost}">
                <h3>${post.strpost}</h3>
              </div>
            </div>
          `
            )
            .join('');
        }
      });
    // Clear search text
    search.value = '';
  } else {
    alert('Please enter a search term');
  }
}

// Fetch post by ID
function getPostById(postID) {
  fetch(`https://www.thepostdb.com/api/json/v1/1/lookup.php?i=${postID}`)
    .then(res => res.json())
    .then(data => {
      const post = data.posts[0];

      addpostToDOM(post);
    });
}

// Fetch random post from API
function getRandomPost() {
  // Clear posts and heading
  postsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  fetch(`https://www.thepostdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
      const post = data.posts[0];

      addPostToDOM(post);
    });
}

// Add post to DOM
function addPostToDOM(post) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (post[`strIngredient${i}`]) {
      ingredients.push(
        `${post[`strIngredient${i}`]} - ${post[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_postEl.innerHTML = `
    <div class="single-post">
      <h1>${post.strpost}</h1>
      <img src="${post.strpostThumb}" alt="${post.strpost}" />
      <div class="single-post-info">
        ${post.strCategory ? `<p>${post.strCategory}</p>` : ''}
        ${post.strArea ? `<p>${post.strArea}</p>` : ''}
      </div>
      <div class="main">
        <p>${post.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

// Event listeners
submit.addEventListener('submit', searchpost);
random.addEventListener('click', getRandomPost);

postsEl.addEventListener('click', e => {
  const postInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('post-info');
    } else {
      return false;
    }
  });

  if (postInfo) {
    const postID = postInfo.getAttribute('data-postid');
    getPostById(postID);
  }
});