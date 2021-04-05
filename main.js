const jobsArr = [];
let current_page = 1;
let job_items = 5;

// GET DATA FROM API
(async function getData() {
  openLoading();
  try {
    const url = await fetch("https://cors-anywhere-venky.herokuapp.com/https://jobs.github.com/positions.json");
    const data = await url.json();

    for (let el of data) { jobsArr.push(el) };

  } catch (err) {
    console.log(err);
  } finally {
    renderMainCard();
  }

})();

// DISPLAY JOB BOXES FROM ARAY 
function buildJobCard(data, items_per_page, page) {

  document.querySelector(".jobs--container").innerHTML = "";
  page--;

  let start = items_per_page * page;
  let end = start + items_per_page;
  let paginatedItems = data.slice(start, end);

  const result = (data < 1) ? `<h2 class="header--no--found"> No results found </h2> `
    :
    paginatedItems.map(job => {
      return `
        <div class="job__box" data-id="${job.id}">
          <div class="job__box--logo">
            <img src="${job.company_logo}" class="img img-logo" alt="company ${job.company} logo">
          </div>

          <div class="job__box--description">
            <h3 class="company--name"> ${job.company} </h3>
            <p class="par par--jobtitle"> ${job.title} </p>
            <p class="par par--jobtime"> ${job.type} </p>
          </div>

          <div class="job__box--location">
            <div class="location--box">
              <span class="span span--icon fas fa-globe"></span>
              <span class="span span--location"> ${job.location} </span>
            </div>
            <div class="location--box">
              <span class="span span--icon far fa-clock"> </span>
              <span class="span span--date"> ${checkDate(job.created_at)} </span>
            </div>
          </div>

        </div>
      `
    }).join("");

  document.querySelector(".jobs--container").innerHTML = result;

  const jobBoxes = document.querySelectorAll(".job__box");
  markJobBox(jobBoxes, data);
}

// DISPLAY JOB BOX DESCRIPTION 
function displayItem(card) {
  const main = document.querySelector("main");
  main.classList.remove("main--main");
  main.classList.add("main--job");

  main.innerHTML = `
    <section class="section section--aside--job">

      <a href="#" class="link link--back">
        <span class="span fas fa-long-arrow-alt-left"></span>
        Back to search
      </a>

      <h2 class="header--apply">
        how to apply
      </h2>

      <div class="apply--card">
        <div class="apply--item">
          <p class="par par--desc">
            Please email a copy of your resume and online portfolio to
          </p>
        </div>
        <div class="apply--item">
          ${card[0].how_to_apply}
        </div>
      </div>

    </section>

    <section class="section section--main--job">
      <div class="detail--item item--column ">
        <div class="detail--title">
          <p class="par par--jobtitle"> ${card[0].title}</p>
          <p class="par par--jobtime"> ${card[0].type} </p>
        </div>
        <div class="job__box--location">
          <div class="location--box">
            <span class="span span--icon  far fa-clock"> </span>
            <span class="span span--date"> ${checkDate(card[0].created_at)}</span>
          </div>
        </div>
      </div>

      <div class="detail--item item--row">
        <div class="job__box--logo">
          <img src="${card[0].company_logo}" class="img img-logo" alt="company ${card[0].company} logo">
        </div>
        <div class="job__box--description">
          <h3 class="company--name"> ${card[0].company} </h3>
          <div class="location--box">
            <span class="span span--icon fas fa-globe"></span>
            <span class="span span--location"> ${card[0].location} </span>
          </div>
        </div>
      </div>

      <div class="detail--item item--column detail--description ">
        ${card[0].description}
      </div>

    </section>
  `;

  const linkBack = document.querySelector(".link--back");
  linkBack.addEventListener("click", renderMainCard);
}

// DISPLAY MAIN CARD
function renderMainCard() {
  const body = document.querySelector(".body");

  body.innerHTML = `
    <header class="header">
      <h1 class="header--title">
        <span class="span span--strong">Github</span>
        <span class="span span--normal">Jobs</span>
      </h1>

    </header>

    <main class="main main--main">

      <section class="section section-form-control">
        <form action="" class="form form--main">

          <span class="span span--icon far fa-folder">
          </span>

          <input
            type="text"
            class="input input--form"
            placeholder="Title, companies, expertise or benefits"
            id="form-input"
            autocomplete="off">

          <label
            for="form-input"
            class="label label--form">
          </label>

          <button class="btn btn--submit" type="submit">
            search
          </button>

        </form>
      </section>

      <section class="section section--aside">

        <div class="input-box input-box-a">

          <input type="checkbox" class="input input--checkbox" id="inputCheckbox" value="Full Time">

          <label for="inputCheckbox" class="label label--checkbox">
            Full time
          </label>

          <span class="span span--checkbox"></span>
        </div>

        <div class="input-box box-column input-box-b">
          <label for="" class="label label-location-header"> location </label>

          <div class="input-box-search">
            <form action="" class="form form--aside">

              <span class="span span--icon fas fa-globe"></span>
              <input
                type="text"
                class="input input-search-location"
                placeholder="City, state, zip code or country"
                autocomplete="off">

            </form>
          </div>
        </div>

        <div class="input-box box-column box-cities input-box-c">

          <ul class="cities">
          
          </ul>
        </div>

      </section>

      <section class="section section--main">

        <div class="jobs--container">
          
        </div>

        <div class="pagination--container">
          <ul class="pagination--list">

          </ul>

        </div>

      </section>

    </main>

    <footer class="footer">
      <span class="span span--footer"> created by </span>
      <a href="https://github.com/maciejwerner/github_jobs" target="_blank" class="link link--footer">
        <strong> Maciej Werner </strong>
      </a>
      <span class="span span--footer"> - </span>
      <a href="https://devchallenges.io/" target="_blank" class="link link--footer">
        devChallenges.io
      </a>
    </footer>
  `;

  buildJobCard(jobsArr, job_items, current_page);
  createCitiesList();
  displayPagination(jobsArr, job_items, current_page);

  const checkBoxJob = document.querySelector("#inputCheckbox");

  checkBoxJob.addEventListener("click", e => {
    const value = e.target.value;
    let result = checkBoxJob.checked ? true : false;

    fullTimeJobs(value, result);
  });

  const formMain = document.querySelector(".form--main");
  const submitBtn = document.querySelector(".btn--submit");
  const formAside = document.querySelector(".form--aside");

  formMain.addEventListener("submit", searchCompany);
  submitBtn.addEventListener("click", searchCompany);
  formAside.addEventListener("submit", searchCity);

}

// DISPLAY BUTTONS IN PAGINATION
function displayPagination(items, rows) {
  const paginationList = document.querySelector(".pagination--list");
  paginationList.innerHTML = "";

  let page_count = Math.ceil(items.length / rows);

  for (let i = 1; i < page_count + 1; i++) {
    let btn = displayPaginationButtons(i, items);
    paginationList.appendChild(btn);
  }
}

// SET ACTIVE BUTTON IN PAGINATION AND CHANGE JOBS SITE
function displayPaginationButtons(i, items) {
  const li = document.createElement("li");
  li.classList.add("pagination--li");

  const btn = document.createElement("button");
  btn.classList.add("btn", "btn--pagination");
  btn.setAttribute("type", "button");
  btn.innerText = `${i}`

  li.appendChild(btn);

  if (current_page === i) btn.classList.add("btn--active");

  btn.addEventListener("click", () => {
    current_page = i;

    buildJobCard(items, job_items, current_page);

    let current_btn = document.querySelector(".pagination--list .btn.btn--active");
    current_btn.classList.remove("btn--active");
    btn.classList.add("btn--active");
  });

  return li;
}

// CREATE DEFAULT INPUTS FOR CITIES TO SEARCH
function createCitiesList() {
  const citiesList = ["London", "Amsterdam", "Berlin", "Rome", "Paris", "New York", "Ottawa"];
  const cities = document.querySelector(".cities");

  const city = citiesList.map(item => {
    return `
      <li class="cities--li">
        <input type="radio" value="${item}" id="${item}" name="city" class="input input--radio">
        <label for="${item}" class="label label--city"> ${item} </label>
      </li>
    `
  }).join("");

  cities.innerHTML = city;

  const citiesBtns = document.querySelectorAll(".input--radio");
  markActiveCityButton(citiesBtns, jobsArr);
}

// DISPLAY CITIES FROM CHECKED BUTTON
function markActiveCityButton(btns, arr) {
  btns.forEach(btn => btn.addEventListener("click", e => {
    const cityVal = e.target.value;
    const cities = arr.filter(({ location }) => location === cityVal);
    buildJobCard(cities, job_items, current_page);
    displayPagination(cities, job_items, current_page);
  }));
}

// FILTER CLICKED JOB BOX
function markJobBox(elements, result) {
  elements.forEach(el => el.addEventListener("click", e => {
    const jobId = e.target.dataset.id;
    const jobCard = result.filter(({ id }) => id === jobId);
    displayItem(jobCard);
  }));
}

// GET DATE AND RETURN DAYS
function checkDate(time) {
  const prevDay = new Date(time).getTime();
  const today = new Date().getTime();

  let difference = Math.ceil((today - prevDay) / (1000 * 3600 * 24));

  if (difference === 0) return `today`;
  else if (difference === 1) return `yestreday`;
  else if (difference > 1) return `${difference} days ago`;
}

// FULL TIME JOBS FILTER
function fullTimeJobs(val, res) {
  if (res) {   // if true
    const result = jobsArr.filter(({ type }) => type === val);
    buildJobCard(result, job_items, current_page);
    displayPagination(result, job_items, current_page);
  } else if (!res) {    // if false
    buildJobCard(jobsArr, job_items, current_page);
    displayPagination(jobsArr, job_items, current_page);
  }
}

// FORM MAIN SEARCH BY TITLE / COMPANY NAME
function searchCompany(e) {
  e.preventDefault();
  const input = document.querySelector(".input--form");
  const inputVal = input.value.trim().toLowerCase();

  if (inputVal !== "") {
    const result = jobsArr.filter(({ description }) => description.toLowerCase().includes(inputVal));
    buildJobCard(result, job_items, current_page);
    displayPagination(result, job_items, current_page);
  } else if (inputVal === "") {
    alert("Fill input");
  }
  input.value = "";
}

// FORM ASIDE SEARCH BY CITY / ZIP CODE / COUNTRY
function searchCity(e) {
  e.preventDefault();
  const input = document.querySelector(".input-search-location");
  const inputVal = input.value.trim().toLowerCase();

  if (inputVal !== "") {
    const result = jobsArr.filter(({ location }) => location.toLowerCase().includes(inputVal));
    buildJobCard(result, job_items, current_page);
    displayPagination(result, job_items, current_page);
  } else if (inputVal === "") {
    alert("Fill input");
  }
  input.value = "";
}

// LOADING
function openLoading() {
  const body = document.querySelector(".body");

  body.innerHTML = `
    <div class="loader">
      <div class="dotContainer">
        <span class="span span--loader span--loader-title">Loading data</span>

        <span class="span span--loader span--loader-dots"></span>
        <span class="span span--loader span--loader-dots"></span>
        <span class="span span--loader span--loader-dots"></span>
      </div>
    </div>
  `;
}