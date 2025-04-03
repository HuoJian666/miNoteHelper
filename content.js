// 使用多种方法确保按钮被添加到页面
window.addEventListener("load", initFunc);

const folderListContainerClassName = "expanded-content";

// 默认设置
const defaultSettings = {
  darkMode: false,
  fontSize: "medium",
  autoSave: true,
  themeColor: "#ff6700",
  hideAllFolder: true,
  hideUnclassified: true, // 添加未分类隐藏设置
};

// 程序入口
function initFunc() {
  createFloatingButton();
  loadSettings().then((settings) => {
    console.log("loadSettings-----", settings);
    handleSetting(settings);
  });
}

// 创建左下角悬浮按钮
function createFloatingButton() {
  // 如果按钮已存在，不重复创建
  if (document.getElementById("mi-note-helper-btn")) {
    console.log("按钮已存在，无需重复创建");
    return;
  }

  console.log("创建小米便签增强助手按钮...");
  const floatingBtn = document.createElement("div");
  floatingBtn.id = "mi-note-helper-btn"; // 添加ID以便检查
  floatingBtn.innerHTML = "⚙️";
  floatingBtn.title = "小米便签增强助手";
  floatingBtn.style.cssText = `
    position: fixed !important;
    bottom: 20px !important;
    left: 20px !important;
    width: 40px !important;
    height: 40px !important;
    background-color: #ff6700 !important;
    color: white !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 24px !important;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
    cursor: pointer !important;
    z-index: 9999999 !important; /* 极高的z-index确保按钮显示在最上层 */
    opacity: 0.9 !important;
    user-select: none !important;
  `;

  document.body.appendChild(floatingBtn);
  console.log("按钮已添加到页面");

  // 点击悬浮按钮
  floatingBtn.addEventListener("click", function () {
    toggleSettingsPanel();
  });
}

function handleSetting(settings) {
  hideSystemAndAll(settings.hideAllFolder, settings.hideUnclassified);
  if (settings.hideAllFolder) {
    applyHideFolderSettings(true);
  }

  if (settings.hideUnclassified) {
    applyHideUnclassifiedSettings(true);
  }
  setTimeout(() => {
    getUsefulTempFolder();
  }, 2000);
}

// 创建或显示设置面板
function toggleSettingsPanel() {
  let panel = document.getElementById("mi-note-settings-panel");

  // 如果面板已存在，切换显示/隐藏状态
  if (panel) {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
    return;
  }

  // 创建设置面板
  panel = document.createElement("div");
  panel.id = "mi-note-settings-panel";
  panel.style.cssText = `
    position: fixed !important;
    bottom: 80px !important;
    left: 20px !important;
    width: 300px !important;
    background-color: white !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
    padding: 16px !important;
    z-index: 9999998 !important;
    font-family: 'Microsoft YaHei', sans-serif !important;
    animation: mi-panel-slide-in 0.3s ease !important;
    user-select: none !important;
  `;

  // 添加CSS动画
  const style = document.createElement("style");
  style.textContent = `
    @keyframes mi-panel-slide-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // 从本地存储加载设置
  loadSettings().then((settings) => {
    console.log("loadSettings-----", settings);
    // 面板内容
    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3 style="margin: 0; color: #333; font-size: 16px;">小米便签增强设置</h3>
        <div id="close-panel-btn" style="cursor: pointer; font-size: 20px; color: #999;">×</div>
      </div>
      
      <div style="margin-bottom: 15px;">
        
        <label style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
          <span style="color: #333;">字体大小</span>
          <select id="setting-font-size" style="padding: 5px; border: 1px solid #ddd; border-radius: 4px;">
            <option value="small" ${
              settings.fontSize === "small" ? "selected" : ""
            }>小</option>
            <option value="medium" ${
              settings.fontSize === "medium" ? "selected" : ""
            }>中</option>
            <option value="large" ${
              settings.fontSize === "large" ? "selected" : ""
            }>大</option>
          </select>
        </label>
        
        <label style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
          <span style="color: #333;">自动保存</span>
          <input type="checkbox" id="setting-auto-save" style="width: 18px; height: 18px;" ${
            settings.autoSave ? "checked" : ""
          }>
        </label>
        
        <label style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
          <span style="color: #333;">主题颜色</span>
          <input type="color" id="setting-theme-color" value="${
            settings.themeColor
          }" style="width: 30px; height: 30px; border: none; padding: 0;">
        </label>
        
        <label style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
          <span style="color: #333;">隐藏全部笔记</span>
          <input type="checkbox" id="setting-hide-all-folders" style="width: 18px; height: 18px;" ${
            settings.hideAllFolder ? "checked" : ""
          }>
        </label>

        <label style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
          <span style="color: #333;">隐藏未分类</span>
          <input type="checkbox" id="setting-hide-unclassified" style="width: 18px; height: 18px;" ${
            settings.hideUnclassified ? "checked" : ""
          }>
        </label>
      </div>
      
      <button id="apply-settings-btn" style="
        background-color: #ff6700;
        color: white;
        border: none;
        padding: 8px 0;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
        font-size: 14px;
        margin-top: 5px;
      ">应用设置</button>
    `;

    document.body.appendChild(panel);

    // 关闭按钮事件
    document
      .getElementById("close-panel-btn")
      .addEventListener("click", function () {
        panel.style.display = "none";
      });

    // 应用设置按钮事件
    document
      .getElementById("apply-settings-btn")
      .addEventListener("click", function () {
        // 获取设置值
        const darkMode =
          document.getElementById("setting-dark-mode")?.checked || false;
        const fontSize = document.getElementById("setting-font-size").value;
        const autoSave = document.getElementById("setting-auto-save").checked;
        const themeColor = document.getElementById("setting-theme-color").value;
        const hideAllFolder = document.getElementById(
          "setting-hide-all-folders"
        ).checked;
        const hideUnclassified = document.getElementById(
          "setting-hide-unclassified"
        ).checked;

        // 保存设置
        const settings = {
          darkMode,
          fontSize,
          autoSave,
          themeColor,
          hideAllFolder,
          hideUnclassified,
        };

        saveSettings(settings).then(() => {
          // 应用隐藏文件夹设置
          applyHideFolderSettings(hideAllFolder);
          // 应用隐藏未分类设置
          applyHideUnclassifiedSettings(hideUnclassified);

          // 显示已应用提示
          alert(
            `设置已应用!\n深色模式: ${
              darkMode ? "开启" : "关闭"
            }\n字体大小: ${fontSize}\n自动保存: ${
              autoSave ? "开启" : "关闭"
            }\n主题颜色: ${themeColor}\n隐藏全部笔记: ${
              hideAllFolder ? "开启" : "关闭"
            }\n隐藏未分类: ${hideUnclassified ? "开启" : "关闭"}`
          );

          // 隐藏面板
          panel.style.display = "none";
        });
      });

    // 点击面板外部关闭面板
    document.addEventListener("click", function (event) {
      if (panel.style.display !== "none") {
        // 检查点击是否在面板内或在按钮上
        if (
          !panel.contains(event.target) &&
          event.target.id !== "mi-note-helper-btn"
        ) {
          panel.style.display = "none";
        }
      }
    });
  });
}

// 保存设置到本地存储
function saveSettings(settings) {
  return new Promise((resolve) => {
    try {
      // 检查chrome.storage是否可用
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.sync
      ) {
        chrome.storage.sync.set({ miNoteSettings: settings }, function () {
          console.log("设置已保存");
          resolve();
        });
      } else {
        // 如果chrome.storage不可用，使用localStorage
        localStorage.setItem("miNoteSettings", JSON.stringify(settings));
        console.log("使用localStorage保存设置（chrome.storage不可用）");
        resolve();
      }
    } catch (error) {
      console.error("保存设置时出错:", error);
      resolve(); // 即使出错也继续执行
    }
  });
}

// 从本地存储加载设置
function loadSettings() {
  return new Promise((resolve) => {
    try {
      // 检查chrome.storage是否可用，尝试从chrome.storage加载设置
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.sync
      ) {
        chrome.storage.sync.get("miNoteSettings", function (result) {
          // 合并默认设置和已保存的设置
          const settings = result.miNoteSettings;
          console.log("从chrome.storage加载的设置:", settings);
          resolve(settings);
          return;
        });
      }

      // 如果chrome.storage不可用，使用localStorage
      const savedSettings = localStorage.getItem("miNoteSettings");
      const settings = savedSettings
        ? JSON.parse(savedSettings)
        : defaultSettings;
      console.log(
        "从localStorage加载的设置（chrome.storage不可用）:",
        settings
      );
      resolve(settings);
      return;
    } catch (error) {
      console.error("加载设置时出错:", error);
      resolve(defaultSettings);
    }
  });
}

// 应用隐藏文件夹设置
function applyHideFolderSettings(hide) {
  setTimeout(() => {
    try {
      // 获取所有文件夹项
      const sidebarItems = getAllSidebarItems();

      if (sidebarItems.length === 0) {
        console.log("没有找到文件夹项");
        // 延迟后再次尝试
        setTimeout(() => applyHideFolderSettings(hide), 2000);
        return;
      }

      // 遍历所有文件夹项，隐藏"我的文件夹"和"未分类"
      sidebarItems.forEach((item) => {
        const text = item.textContent.trim();
        // 检查是否包含"我的文件夹"或"未分类"
        if (text.includes("我的文件夹") || text.includes("未分类")) {
          if (hide) {
            item.style.display = "none";
            console.log(`已隐藏: ${text}`);
          } else {
            item.style.display = "";
            console.log(`已显示: ${text}`);
          }
        }
      });

      console.log(`系统文件夹隐藏设置已${hide ? "开启" : "关闭"}`);
    } catch (error) {
      console.error("应用隐藏文件夹设置时出错:", error);
    }
  }, 1000);
}

// 添加应用隐藏未分类设置的函数
function applyHideUnclassifiedSettings(hide) {
  setTimeout(() => {
    try {
      // 获取所有文件夹项
      const sidebarItems = getAllSidebarItems();

      if (sidebarItems.length === 0) {
        console.log("没有找到文件夹项");
        // 延迟后再次尝试
        setTimeout(() => applyHideUnclassifiedSettings(hide), 2000);
        return;
      }

      // 遍历所有文件夹项，只隐藏"未分类"
      sidebarItems.forEach((item) => {
        const text = item.textContent.trim();
        // 只检查是否包含"未分类"
        if (text.includes("未分类")) {
          if (hide) {
            item.style.display = "none";
            console.log(`已隐藏未分类: ${text}`);
          } else {
            item.style.display = "";
            console.log(`已显示未分类: ${text}`);
          }
        }
      });

      console.log(`未分类文件夹隐藏设置已${hide ? "开启" : "关闭"}`);
    } catch (error) {
      console.error("应用隐藏未分类设置时出错:", error);
    }
  }, 1000);
}

// 通过部分类名查找元素
function findElementsByPartialClassName(partialClassName) {
  try {
    // 使用CSS选择器查找包含指定部分类名的所有元素
    const elements = document.querySelectorAll(
      `[class*="${partialClassName}"]`
    );
    const foundElements = Array.from(elements);
    return foundElements;
  } catch (error) {
    console.error(`查找类名包含 "${partialClassName}" 的元素时出错:`, error);
    return [];
  }
}

// 获取expanded-content下包含"b-有用暂存"的sidebar-item元素
function getUsefulTempFolder() {
  // 首先找到class包含expanded-content的元素
  const folderContainerArray = findElementsByPartialClassName(
    folderListContainerClassName
  );

  if (!folderContainerArray.length) {
    console.log("未找到expanded-content元素");
    return;
  }
  const folderContainer = folderContainerArray[0];

  const sidebarItems = folderContainer.querySelectorAll(
    '[class*="sidebar-item"]'
  );
  console.log("sidebarItems", sidebarItems);
  // 遍历sidebar-item元素，检查是否包含"b-有用暂存"文本
  let targetItem;

  sidebarItems.forEach((item) => {
    if (item.textContent.includes("b-有用暂存")) {
      console.log("找到有用暂存文件夹元素:", item);
      targetItem = item;
    }
  });

  if (!targetItem) {
    console.log("查找目标sidebar-item失败");
    return;
  }

  console.log("找到目标sidebar-item", targetItem);
  targetItem.click();
}

// 如果需要点击该元素，可以使用下面的函数
function clickUsefulTempFolder() {
  const folderElement = getUsefulTempFolder();
  if (folderElement) {
    console.log("点击有用暂存文件夹");
    folderElement.click();
    return true;
  } else {
    console.log("未找到有用暂存文件夹，无法点击");
    return false;
  }
}

/**
 * 隐藏指定的DOM元素
 * @param {HTMLElement} element - 要隐藏的DOM元素
 * @param {string} [description=''] - 元素的描述，用于日志记录
 * @returns {boolean} - 操作是否成功
 */
function hideDomElement(element) {
  try {
    if (!element || !(element instanceof HTMLElement)) {
      console.error("hideDomElement: 无效的DOM元素", element);
      return false;
    }

    // 直接隐藏元素
    element.style.display = "none";
    console.log(`已隐藏元素`);
  } catch (error) {
    console.error(`隐藏元素时出错:`, error);
  }
}

function hideSystemAndAll(hideAllFolder, hideUnclassified) {
  const [container] = findElementsByPartialClassName("sidebar-body");
  if (!container) {
    console.log("未找到sidebar-body元素");
    return;
  }

  const sidebarItems = container.querySelectorAll('[class*="sidebar-item"]');

  const targetItems = [];
  sidebarItems.forEach((item) => {
    if (hideAllFolder && item.textContent.includes("全部笔记")) {
      targetItems.push(item);
    }
    if (hideUnclassified && item.textContent.includes("未分类")) {
      targetItems.push(item);
    }
  });

  targetItems.forEach((item) => {
    item.style.display = "none";
  });
}

function hideSidebarItem(hideUnclassified) {}
