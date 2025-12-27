// URL追加削除
const addBtn = document.getElementById("addBtn");
const titleInput = document.getElementById("title");
const urlInput = document.getElementById("url");
const linkList = document.getElementById("linkList");
const savedCategories = localStorage.getItem("categories");
const newCategoryInput = document.getElementById("newCategory");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const filterSelect = document.getElementById("filterSelect");

let links = [];

let categories = [];

function renderLinks(filteredLinks = links) {
  linkList.innerHTML = "";

  filteredLinks.forEach((link, index) => {
    if (!link.category && categories.length > 0) {
      link.category = categories[0];
    }

    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = link.title;
    a.href = link.url;
    a.target = "_blank";

    // カテゴリ選択
    const select = document.createElement("select");
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      if (cat === link.category) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    // 🔥 自動保存
    select.addEventListener("change", () => {
      link.category = select.value;
      localStorage.setItem("links", JSON.stringify(links));
      renderLinks();
    });

    // 削除ボタン
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "削除";
    deleteBtn.addEventListener("click", () => {
      links = links.filter(l => l !== link);
      localStorage.setItem("links", JSON.stringify(links));
      renderLinks();
    });

    li.appendChild(a);
    li.appendChild(select);
    li.appendChild(deleteBtn);
    linkList.appendChild(li);
  });
}

// 保存データ復元
const savedLinks = localStorage.getItem("links");
if (savedLinks) {
  links = JSON.parse(savedLinks);
}

// 追加ボタン
addBtn.addEventListener("click", () => {
  const title = titleInput.value;
  const url = urlInput.value;

  if (!title || !url) return;

  links.push({ title, url });
  localStorage.setItem("links", JSON.stringify(links));

  renderLinks();

  titleInput.value = "";
  urlInput.value = "";
});

// カテゴリ追加
if (savedCategories) {
  categories = JSON.parse(savedCategories);
}

addCategoryBtn.addEventListener("click", () => {
  const newCat = newCategoryInput.value.trim();
  if (!newCat) return;

  if (!categories.includes(newCat)) {
    categories.push(newCat);
    localStorage.setItem("categories", JSON.stringify(categories));
    renderLinks();
    renderCategoryList();
    renderFilter();
  }

  newCategoryInput.value = "";
});

// カテゴリ削除
function renderCategoryList() {
  categoryList.innerHTML = "";

  categories.forEach((cat) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const delBtn = document.createElement("button");

    span.textContent = cat;
    delBtn.textContent = "削除";

    delBtn.addEventListener("click", () => {
      deleteCategory(cat);
    });

    li.appendChild(span);
    li.appendChild(delBtn);
    categoryList.appendChild(li);
  });
}

function deleteCategory(catToDelete) {
  // カテゴリ削除
  categories = categories.filter(c => c !== catToDelete);

  // カテゴリが0になったら保険
  if (categories.length === 0) {
    categories.push("未分類");
  }

  // リンク側のカテゴリを付け替え
  links.forEach(link => {
    if (link.category === catToDelete) {
      link.category = categories[0];
    }
  });

  // 保存
  localStorage.setItem("categories", JSON.stringify(categories));
  localStorage.setItem("links", JSON.stringify(links));

  // 再描画
  renderCategoryList();
  renderFilter();
  renderLinks();
}

// フィルター機能
function renderFilter() {
  filterSelect.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "すべて";
  filterSelect.appendChild(allOption);

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filterSelect.appendChild(option);
  });
}

filterSelect.addEventListener("change", () => {
  const selected = filterSelect.value;

  if (selected === "all") {
    renderLinks();
  } else {
    const filtered = links.filter(
      link => link.category === selected
    );
    renderLinks(filtered);
  }
});

const triggerArea = document.getElementById("secretTrigger");
const secretArea = document.getElementById("secretArea");

let count = 0;
let timer = null;

const LIMIT_TIME = 200; // 制限時間（ms）
const NEED_COUNT = 2;    // 必要クリック数

triggerArea.addEventListener("click", () => {
  // 初回クリックでタイマー開始
  if (count === 0) {
    timer = setTimeout(() => {
      count = 0;
      timer = null;
      console.log("時間切れ！リセット");
    }, LIMIT_TIME);
  }

  count++;
  console.log(`連打数: ${count}`);

  // 成功判定
  if (count >= NEED_COUNT) {
    clearTimeout(timer);
    timer = null;
    count = 0;

    secretArea.style.display = "block";
    console.log("シークレット解放！！！");
  }
});

renderCategoryList();
renderFilter();
renderLinks();
