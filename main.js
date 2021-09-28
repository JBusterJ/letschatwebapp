var email;
var firebaseConfig = {
    apiKey: "AIzaSyAGAi2p52Xk8vgAQiDZmj4-GRF5rJ_4y-o",
    authDomain: "andromeda-2b-14196.firebaseapp.com",
    projectId: "andromeda-2b-14196",
    storageBucket: "andromeda-2b-14196.appspot.com",
    messagingSenderId: "793693836395",
    appId: "1:793693836395:web:6eede2d74b9fd912d18d2e"
};

firebase.initializeApp(firebaseConfig);
firebaseConfig = window.btoa(firebaseConfig);

let postCollection = document.querySelector("#posts-collection");
var postcreationcount = 0;
const db = firebase.firestore();

function createPostInFirebase(title, time, content, author) {
    console.log(title, time, content, author);
    db.collection("posts").add({
        postName: title,
        createdAt: time,
        postContent: content,
        author: author
    }).then(function (docRef) {
        console.log("Document created:", docRef.id);
        getPosts();
    });
}
var path = window.location.pathname;
var page = path.split("/").pop();

console.log( page );

if (localStorage.getItem("accountEmail") != null) {
    email = localStorage.getItem("accountEmail");
    if(page == "index.html"){
        location.href = "posting.html";
    }
}

function getPosts() {
    db.collection("posts")
        .get()
        .then(snapshot => {
            if (snapshot.docs.length == 0) {
                console.log("no data found");
                createPost("", "", "", "", true);
            } else {
                document.querySelector("#posts-collection").innerHTML = "";
                snapshot.docs.forEach(docs => {
                    if (docs.data().postName != "post title") {
                        createPost(
                            docs.data().postName,
                            docs.data().createdAt,
                            docs.data().postContent,
                            docs.data().author,
                            false
                        );
                        // console.log(docs.data());
                    } else {
                        console.log("Developer post found, not commencing with the post of ", docs.data());
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
}

getPosts();

function login() {
    localStorage.setItem("accountEmail", document.getElementById("email").value);
    location.href = "posting.html";
}

function logout() {
    localStorage.removeItem("accountEmail");
    location.href = "index.html";
}

function createPost(title, time, content, author, clearData) {
    // get number of posts in firebase database
    db.collection("posts").get().then(function (querySnapshot) {
        var num = querySnapshot.size;
        let div = document.createElement("div");
        div.setAttribute("class", "col-md-4");
        div.setAttribute("id", "articlesAndComments");

        let h1 = document.createElement("h1");
        let p = document.createElement("p");
        let auth = document.createElement("abbr");

        h1.textContent = title;
        auth.textContent = author + " - " + time;
        p.innerHTML = displayMarkdown(content);

        div.appendChild(h1);
        div.appendChild(auth);
        div.appendChild(p);

        postCollection.appendChild(div);
        postcreationcount++;
    });

    if (clearData) {
        document.getElementById("articlesAndComments").innerHTML = "";
    }
}

var vm = new Vue({
    el: '#root',
    data: {
        mdRaw: '',
        mdRawRender: ''
    },
    watch: {
        mdRaw: function () {
            this.mdRender()
        }
    },
    created() {
        this.mdRaw = `
# Posts go here
        `
    },
    methods: {
        mdRender: function () {
            this.mdRawRender = marked(this.mdRaw);
        }
    }
})


function displayMarkdown(md) {
    var mdRawRender = marked(md);
    return mdRawRender;
}

function gt(id){
    return document.getElementById(id);
}

function lg(item){
    return localStorage.getItem(item);
}