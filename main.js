"use strict";
window.onload = function () {
  // Make navbar transparent when it is on the top
  const navbar = document.querySelector("#navbar");
  const navbarHeight = navbar.getBoundingClientRect().height;
  document.addEventListener("scroll", () => {
    if (window.scrollY > navbarHeight) {
      navbar.classList.add("navbar--dark");
    } else {
      navbar.classList.remove("navbar--dark");
    }
  });

  // Handle scrolling when tapping on the navbar menu
  const navbarMenu = document.querySelector(".navbar__menu");
  navbarMenu.addEventListener("click", (event) => {
    const target = event.target;
    console.log(target);
    const link = target.dataset.link;
    if (link == null) {
      return;
    }
    navbarMenu.classList.remove("open");
    scrollIntoView(link);
  });

  // Navbar menu actived for scrolling
  // 1. section 요소 가져오기
  // 2. 요소들을 obverse하기
  // 3. 보여지는 색션에 해당하는 아이템 활성화하기
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".navbar__menu__item");
  const sectionIds = [];
  navItems.forEach((item) => sectionIds.push(item.dataset.link));

  let selectedNavIndex = 0;
  let selectedNavItem = navItems[0];
  /**
   * 이전 selecteditem의 active를 삭제하고 현재 selecteditem의 active를 추가
   * @param {navbar__menu__Item} selected
   */
  function selectNavItem(selected) {
    selectedNavItem.classList.remove("active");
    selectedNavItem = selected;
    selectedNavItem.classList.add("active");
  }

  // 2. observe : section 요소를 observe하기
  const observerOptions = {
    root: null,
    rootMagin: "0px",
    threshold: 0.3,
  };
  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting && entry.intersectionRatio > 0) {
        const index = sectionIds.indexOf(`#${entry.target.id}`);
        if (entry.boundingClientRect.y < 0) {
          selectedNavIndex = index + 1;
        } else {
          selectedNavIndex = index - 1;
        }
      }
    });
  };
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach((section) => {
    observer.observe(section);
  });

  // 3. wheel : navbar item selected
  window.addEventListener("wheel", (e) => {
    if (window.scrollY === 0) {
      selectedNavIndex = 0;
    } else if (
      window.scrollY + window.innerHeight ===
      document.body.clientHeight
    ) {
      selectedNavIndex = navItems.length - 1;
    }
    selectNavItem(navItems[selectedNavIndex]);
  });
  // 4. keyup -> scroll : navbar item selected
  window.addEventListener("keyup", (e) => {
    window.addEventListener("scroll", (e) => {
      if (window.scrollY === 0) {
        selectedNavIndex = 0;
      } else if (
        window.scrollY + window.innerHeight ===
        document.body.clientHeight
      ) {
        selectedNavIndex = navItems.length - 1;
      }
      selectNavItem(navItems[selectedNavIndex]);
    });
  });

  // Navbar toggle button for small screen
  const navbarToggleBtn = document.querySelector(".navbar__toggle-btn");
  navbarToggleBtn.addEventListener("click", () => {
    navbarMenu.classList.toggle("open");
  });

  // Handle click on "contact me" button on home
  const homeContact = document.querySelector(".home__contact");
  homeContact.addEventListener("click", () => {
    scrollIntoView("#contact");
  });

  // Make home slowly fade to transparent as the window scrolls dwon
  const home = document.querySelector(".home__container");
  const homeHeight = home.getBoundingClientRect().height;
  document.addEventListener("scroll", () => {
    home.style.opacity = 1 - window.scrollY / homeHeight;
  });

  // Show "arrow up" button when scrolling down
  const arrowUp = document.querySelector("#arrow-up");
  document.addEventListener("scroll", () => {
    if (window.scrollY > homeHeight / 2) {
      arrowUp.classList.add("visible");
    } else {
      arrowUp.classList.remove("visible");
    }
  });

  // Handle click on the "arrow up" button
  arrowUp.addEventListener("click", () => {
    scrollIntoView("#home");
  });

  // Projects
  const workBtnContainer = document.querySelector(".work__categories");
  const projectContainer = document.querySelector(".work__projects");
  const projects = document.querySelectorAll(".project");
  workBtnContainer.addEventListener("click", (e) => {
    const filter =
      e.target.dataset.filter || e.target.parentNode.dataset.filter;
    if (filter == null) {
      return;
    }

    // Remove selection from the previous item and select the new one
    const active = document.querySelector(".category__btn.selected");
    active.classList.remove("selected");
    const target =
      e.target.nodeName === "BUTTON" ? e.target : e.target.parentNode;
    target.classList.add("selected");

    projectContainer.classList.add("anim-out");
    setTimeout(() => {
      projects.forEach((project) => {
        if (filter === "*" || filter === project.dataset.type) {
          project.classList.remove("invisible");
        } else {
          project.classList.add("invisible");
        }
      });
      projectContainer.classList.remove("anim-out");
    }, 300);
  });

  // scrollIntoView(selector)
  /**
   * 화면 이동하려는 querySelector 지정
   * @param {querySelector} selector
   */
  function scrollIntoView(selector) {
    const scrollTo = document.querySelector(selector);
    scrollTo.scrollIntoView({ behavior: "smooth" });
    selectNavItem(navItems[sectionIds.indexOf(selector)]);
  }
};
