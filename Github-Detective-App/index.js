const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');
const searchBarForm = document.querySelector('.search-bar');

const themeChangeBtn = document.querySelector('#theme-change-btn');
let theme = 'dark';
themeChangeBtn.addEventListener('click',()=>{
    if(theme === 'dark'){
        theme = 'light';
        document.body.display = 'white';
    }else{
        theme = 'dark'
    }
    console.log(theme)
})
const cross = document.querySelector('#cross');
searchInput.addEventListener('input',()=>{
    console.log(searchInput.value);
    if(searchInput.value){
        cross.style.display = 'block';
    }else{
        cross.style.display = 'none';
    }

})

cross.addEventListener('click',()=>{
    searchInput.value = '';
    cross.style.display = 'none';
    errorDiv.classList.remove('error-active')
})

// fetching user info elements
const userPhoto = document.querySelector('#photo');
const userName = document.querySelector('#name');
const joinDate = document.querySelector('#date');
const userNamePara = document.querySelector('#username');
const userBio = document.querySelector('#bio');
const repoNumber = document.querySelector('#repo-number');
const followersNumber = document.querySelector('#followers-number');
const followingsNumber = document.querySelector('#followings-number');
const locationName = document.querySelector('#location-name');
const websiteName = document.querySelector('#website-name');
const twitterName = document.querySelector('#twitter-name');
const workName = document.querySelector('#work-name');


const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function updateInfoIntoHtml(data){
    userPhoto.src = `${data.avatar_url}`;
    userName.innerText = data.name === null ? 'aaa' : data.name;
    datesegments = data.created_at.split("T").shift().split("-");
    joinDate.innerText = `Joined ${datesegments[2]} ${months[datesegments[1] - 1]} ${datesegments[0]}`;
    userNamePara.innerText = `@${data.login}`;
    userBio.innerText = data.bio == null ? "This profile has no bio" : `${data.bio}`;
    repoNumber.innerText = `${data.public_repos}`;
    followersNumber.innerText =`${data.followers}`;
    followingsNumber.innerText =`${data.following}`;
    locationName.innerText = data.location ===null ? 'Not Available' : data.location;
    websiteName.innerText = data.blog ==="" ? 'Not Available': data.blog;
    console.log(data.blog)
    websiteName.href = data.blog ==="" ? 'Not Available': data.blog;
    websiteName.innerText = data.blog ==="" ? 'Not Available': data.blog;
    console.log(data.twitter_username)
    twitterName.innerText = data.twitter_username === null ? 'Not Available' : `${data.twitter_username}`;
    twitterName.href = data.twitter_username === null ? 'Not Available' : `https://twitter.com/${data.twitter_username}`;
    workName.innerText = data.company === null ? 'Not available' : data.company;



}
fetchUserInfo('mohammedaslaan');
const errorDiv = document.querySelector('.error');
async function fetchUserInfo(name){
    try{
        let response = await fetch(`https://api.github.com/users/${name}`)
        //console.log(response);
        let data = await response.json();
        console.log(data)
        if(data.message!='Not Found'){
            updateInfoIntoHtml(data);
        }else{
            console.log('not foundede')
            errorDiv.classList.add('error-active')
        }
        
    }
    catch (err){
        console.log('Error aaya hai',err);
        errorDiv.classList.add('error-active')
        
    }

    

}
searchBarForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    console.log(searchInput.value);
    username = searchInput.value;
    fetchUserInfo(username);

})