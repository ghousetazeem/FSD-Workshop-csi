const listElement = document.querySelector(".posts");
const postTemplate = document.getElementById("single-post");
const form = document.querySelector("#new-post form");
const fetchButton = document.querySelector("#available-posts button");

// Here we use an external library called axios which is very convenient in making http requests
// We dont to define any external function which which handle all your requests
// Just include the script and call axios globally with a method!

// All functions remain the same

function generatePostTemplate(post) {
    const postEl = document.importNode(postTemplate.content, true);
    postEl.querySelector("h2").textContent = post.title.toUpperCase();
    postEl.querySelector("p").textContent = post.body.toUpperCase();
    postEl.querySelector("li").id = post.id;

    return postEl;
}

async function fetchPosts() {
    try {
        const response = await axios.get(
            "https://jsonplaceholder.typicode.com/posts"
        );
        const responsePosts = response.data;

        for (i = 0; i < 10; i++) {
            const postEl = generatePostTemplate(responsePosts[i]);
            listElement.append(postEl);
        }
    } catch (error) {
        alert(error.message);
        console.log(error.response);
    }
}

async function createPost(title, content) {
    const userId = Math.random();
    const post = {
        title,
        body: content,
        userId,
        id : listElement.childElementCount + 1
    };

    const postEl = generatePostTemplate(post);
    listElement.prepend(postEl);

    const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        post
    );
    console.log(response);
}

fetchButton.addEventListener("click", fetchPosts);
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const enteredTitle = event.currentTarget.querySelector("#title").value;
    const enteredContent = event.currentTarget.querySelector("#content").value;

    createPost(enteredTitle, enteredContent);
});

listElement.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
        const postId = event.target.closest("li").id;
        axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
        document.getElementById(`${postId}`).remove();
    }
});
