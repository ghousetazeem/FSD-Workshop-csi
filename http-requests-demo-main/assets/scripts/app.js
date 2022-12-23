const listElement = document.querySelector(".posts");
const postTemplate = document.getElementById("single-post");
const form = document.querySelector("#new-post form");
const fetchButton = document.querySelector("#available-posts button");

// A request handler function which performs various types of http requests when the method is passed as a parameter
function sendHttpRequest(method, url, data) {
    // -------------USING XMLHTTPREQUEST---------------------
    // const promise = new Promise((resolve, reject) => {
    // const xhr = new XMLHttpRequest();
    // xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.setRequestHeader("Dummy-Header", "No One cares!");

    // xhr.open(method, url);
    // xhr.responseType = "json";

    // xhr.onload = function () {
    //     if (xhr.status >= 200 && xhr.status <= 300) {
    //         resolve(xhr.response);
    //     } else {
    //         reject(new Error("Something Went wrong!"));
    //     }
    // };

    // xhr.onerror = function () {
    //     reject(new Error("Failed to send request!"));
    // };

    // xhr.send(JSON.stringify(data));

    // });
    // return promise;
    // ------------------------------------------------------

    // -----------------USING FETCH API----------------------
    return fetch(url, {
        method,
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Dummy-Header": "No One cares!",
        },
    }).then((response) => {
        if (response.status >= 200 && response.status <= 300) {
            return response.json();
        } else {
            return response.json().then(errData => {
                console.log(errData);
                throw new Error("Something went wrong - Server Side!");
            })
        }
    }).catch(error => {
        alert(error);
        throw new Error("Something went wrong!");
    });
    // ------------------------------------------------------
}

// A function which creates a DOM node
function generatePostTemplate(post) {
    const postEl = document.importNode(postTemplate.content, true);
    postEl.querySelector("h2").textContent = post.title.toUpperCase();
    postEl.querySelector("p").textContent = post.body.toUpperCase();
    postEl.querySelector("li").id = post.id;

    return postEl;
}

// Fetch posts button which uses the get method to fetch data from the server
async function fetchPosts() {
    try {
        const responseData = await sendHttpRequest(
            "GET",
            "https://jsonplaceholder.typicode.com/posts"
        );
        const responsePosts = responseData;

        for (i = 0; i < 10; i++) {
            const postEl = generatePostTemplate(responsePosts[i]);
            listElement.append(postEl);
        }
    } catch (error) {
        alert(error.message);
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

    sendHttpRequest("POST", "https://jsonplaceholder.typicode.com/posts", post);
}

// Submit button which uses post method to send data to the server
fetchButton.addEventListener("click", fetchPosts);
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const enteredTitle = event.currentTarget.querySelector("#title").value;
    const enteredContent = event.currentTarget.querySelector("#content").value;

    createPost(enteredTitle, enteredContent);
});

// Delete button which uses delete method to send a request for deleting content from the server
listElement.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
        const postId = event.target.closest("li").id;
        sendHttpRequest(
            "DELETE",
            `https://jsonplaceholder.typicode.com/posts/${postId}`
        );
        document.getElementById(`${postId}`).remove();
    }
});
