const getUsername = document.querySelector("#user") as HTMLInputElement;
const formSubmit = document.querySelector("#form") as HTMLFormElement;
const main_container = document.querySelector(".main_container") as HTMLElement;

// DEFINING THE CONTRACT OF AN OBJECT

interface UserDate {
    id: number;
    login: string;
    avatar_url: string;
    location: string;
    url: string;
}

//Reusable Function

async function myCustomFetcher<T>(url: string): Promise<T> {
    const res = await fetch(url)

    if (!res.ok) {
        throw new Error(`Network response was not ok - status:${res.status}`)
    }

    const data = await res.json()
    console.log(data)
    return data
}
//TO DISPLAY THE CARD UI

const showResultUI = (singleUser: UserDate) => {
    const { avatar_url, login, url } = singleUser
    main_container.insertAdjacentHTML(
        "beforeend",
        `<div class="card">
        <img src=${avatar_url} alt = ${login}/>
        <hr/>
        <div class="card-footer">
                    <img src=${avatar_url} alt = ${login}/>
                    <a href ="${url}">Github<a/>

        </div>
        </div>`
    )
}

function fetchUserData(url: string) {
    myCustomFetcher<UserDate[]>(url).then((userInfo) => {
        for (const singleUser of userInfo) {
            showResultUI(singleUser)
            console.log("login " + singleUser.login)
        }
    })
}

//CALLING A FUNCTION DURING FIRST PAGE LOAD
fetchUserData("https://api.github.com/users")

//FOR SEARCH FUNCTIONALITY

formSubmit.addEventListener('submit', async (event) => {
    event.preventDefault();


    const searchedTerm = getUsername.value.toLowerCase();

    try {
        const url = "https://api.github.com/users";
        const allUserdata = await myCustomFetcher<UserDate[]>(url)

        const matchingUsers = allUserdata.filter((user) => {
            return user.login.toLowerCase().includes(searchedTerm)
        })

        main_container.innerHTML = ""

        if (matchingUsers.length === 0) {
            main_container.insertAdjacentHTML(
                "beforeend",
                `<p class = "empty-msg"> No matching users found</p>`
            )
        } else {
            for (const singleUser of matchingUsers) {
                showResultUI(singleUser)
            }
        }
    } catch (error) {
        console.log(error)
    }
})