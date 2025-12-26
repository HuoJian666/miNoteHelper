// 使用多种方法确保按钮被添加到页面
window.addEventListener("load", initFunc);

const folderListContainerClassName = "expanded-content";

// 默认设置
const defaultSettings = {
  hideAllFolder: true,
  hideUnclassified: true,
  floatingToc: false,
  tocShowH1: true,
  tocShowH2: true,
  tocShowH3: true,
  collapseNoteList: false, // 显示笔记列表折叠按钮
  defaultCollapseNoteList: false, // 默认折叠笔记列表
  customFolderVisibility: {}, // 自定义文件夹显示/隐藏状态 {folderName: boolean}
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
    z-index: 9999999 !important;
    opacity: 0.9 !important;
    user-select: none !important;
    transition: all 0.3s ease !important;
  `;

  document.body.appendChild(floatingBtn);
  console.log("按钮已添加到页面");

  // 鼠标悬停展开设置面板
  floatingBtn.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.1)";
    this.style.boxShadow = "0 4px 16px rgba(0,0,0,0.3)";
    expandSettingsPanel();
  });

  floatingBtn.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1)";
    this.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
  });
}

function handleSetting(settings) {
  console.log("handleSetting被调用，设置:", settings);
  
  // 立即尝试隐藏
  hideSystemAndAll(settings.hideAllFolder, settings.hideUnclassified);
  
  // 延迟后再次尝试（DOM可能还未完全加载）
  setTimeout(() => {
    console.log("延迟500ms后再次尝试隐藏);
    hideSystemAndAll(settings.hideAllFolder, settings.hideUnclassified);
  }, 500);
  
  setTimeout(() => {
    console.log("延迟1500ms后再次尝试隐藏);
    hideSystemAndAll(settings.hideAllFolder, settings.hideUnclassified);
  }, 1500);
  
  // 应用自定义文件夹显示设置
  if (settings.customFolderVisibility && Object.keys(settings.customFolderVisibility).length > 0) {
    setTimeout(() => {
      applyCustomFolderVisibility(settings.customFolderVisibility);
    }, 500);
    setTimeout(() => {
      applyCustomFolderVisibility(settings.customFolderVisibility);
    }, 2000);
  }
  
  // 应用悬浮目录设置
  if (settings.floatingToc) {
    setTimeout(() => {
      createFloatingToc();
      // 设置笔记切换监听器
      setupNoteChangeObserver();
    }, 1500);
    // 再次尝试，确保内容已加载
    setTimeout(() => {
      createFloatingToc();
    }, 3000);
  }
  
  // 应用笔记列表折叠设置
  if (settings.collapseNoteList) {
    setTimeout(() => {
      setupNoteListCollapse(settings.defaultCollapseNoteList);
    }, 1500);
  }
  
  // 自动打开有用暂存文件夹
  setTimeout(() => {
    getUsefulTempFolder();
  }, 2000);
}

// 创建或显示设置面板
// 展开设置面板
function expandSettingsPanel() {
  // 如果设置面板已存在，不重复创建
  let panel = document.getElementById("mi-note-settings-panel");
  if (panel) {
    return;
  }

  // 从本地存储加载设置
  loadSettings().then((settings) => {
    console.log("loadSettings-----", settings);

  // 创建设置面板
  panel = document.createElement("div");
  panel.id = "mi-note-settings-panel";
  panel.style.cssText = `
    position: fixed !important;
      bottom: 20px !important;
    left: 20px !important;
    width: 300px !important;
    background-color: white !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
    padding: 16px !important;
    z-index: 9999998 !important;
    font-family: 'Microsoft YaHei', sans-serif !important;
    user-select: none !important;
  `;

    // 面板内容
    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3 style="margin: 0; color: #333; font-size: 16px;">小米便签增强设置</h3>
      </div>
      
      <!-- 笔记目录设置分组 -->
      <div style="margin-bottom: 15px; padding-top: 10px; border-top: 2px solid #f0f0f0;">
        <div style="font-size: 14px; font-weight: bold; color: #ff6700; margin-bottom: 10px;">
          📂 笔记目录设置
        </div>
        
        <label style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0 8px 12px; border-bottom: 1px solid #f5f5f5;">
          <span style="color: #666; font-size: 13px;">隐藏全部笔记</span>
          <input type="checkbox" id="setting-hide-all-folders" style="width: 18px; height: 18px;" ${
            settings.hideAllFolder ? "checked" : ""
          }>
        </label>
        
        <label style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0 8px 12px; border-bottom: 1px solid #f5f5f5;">
          <span style="color: #666; font-size: 13px;">隐藏未分类/span>
          <input type="checkbox" id="setting-hide-unclassified" style="width: 18px; height: 18px;" ${
            settings.hideUnclassified ? "checked" : ""
          }>
        </label>
        
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0 8px 12px;">
          <span style="color: #666; font-size: 13px;">自定义目录显示/span>
          <button id="manage-folders-btn" style="
            background-color: #ff6700;
            color: white;
            border: none;
            padding: 4px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          ">管理</button>
        </div>
      </div>
      
      <!-- 悬浮目录设置分组 -->
      <div style="margin-bottom: 15px; padding-top: 10px; border-top: 2px solid #f0f0f0;">
        <div style="font-size: 14px; font-weight: bold; color: #ff6700; margin-bottom: 10px;">
          📑 悬浮目录设置
        </div>
        
        <label style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0 8px 12px; border-bottom: 1px solid #f5f5f5;">
          <span style="color: #666; font-size: 13px;">启用悬浮目录</span>
          <input type="checkbox" id="setting-floating-toc" style="width: 18px; height: 18px;" ${
            settings.floatingToc ? "checked" : ""
          }>
        </label>
        
        <label style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0 8px 12px; border-bottom: 1px solid #f5f5f5;">
          <span style="color: #666; font-size: 13px;">显示H1</span>
          <input type="checkbox" id="setting-toc-show-h1" style="width: 18px; height: 18px;" ${
            settings.tocShowH1 ? "checked" : ""
          }>
        </label>

        <label style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0 8px 12px; border-bottom: 1px solid #f5f5f5;">
          <span style="color: #666; font-size: 13px;">显示H2</span>
          <input type="checkbox" id="setting-toc-show-h2" style="width: 18px; height: 18px;" ${
            settings.tocShowH2 ? "checked" : ""
          }>
        </label>
        
        <label style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0 8px 12px;">
          <span style="color: #666; font-size: 13px;">显示H3</span>
          <input type="checkbox" id="setting-toc-show-h3" style="width: 18px; height: 18px;" ${
            settings.tocShowH3 ? "checked" : ""
          }>
        </label>
      </div>
      
      <!-- 布局设置分组 -->
      <div style="margin-bottom: 15px; padding-top: 10px; border-top: 2px solid #f0f0f0;">
        <div style="font-size: 14px; font-weight: bold; color: #ff6700; margin-bottom: 10px;">
          🎨 布局设置
        </div>
        
        <label style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0 8px 12px;">
          <span style="color: #666; font-size: 13px;">显示笔记列表折叠按钮</span>
          <input type="checkbox" id="setting-collapse-note-list" style="width: 18px; height: 18px;" ${
            settings.collapseNoteList ? "checked" : ""
          }>
        </label>
        
        <label id="default-collapse-label" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0 8px 24px; opacity: ${settings.collapseNoteList ? "1" : "0.5"};">
          <span style="color: #666; font-size: 13px;">默认折叠笔记列表</span>
          <input type="checkbox" id="setting-default-collapse-note-list" style="width: 18px; height: 18px;" ${
            settings.defaultCollapseNoteList ? "checked" : ""
          } ${settings.collapseNoteList ? "" : "disabled"}>
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

    // 添加文件夹管理按钮事件
    document.getElementById("manage-folders-btn").addEventListener("click", function() {
      openFolderManagementDialog();
    });

    // 添加折叠按钮的联动逻辑
    const collapseNoteListCheckbox = document.getElementById("setting-collapse-note-list");
    const defaultCollapseCheckbox = document.getElementById("setting-default-collapse-note-list");
    const defaultCollapseLabel = document.getElementById("default-collapse-label");
    
    collapseNoteListCheckbox.addEventListener("change", function() {
      if (this.checked) {
        defaultCollapseCheckbox.disabled = false;
        defaultCollapseLabel.style.opacity = "1";
      } else {
        defaultCollapseCheckbox.disabled = true;
        defaultCollapseCheckbox.checked = false;
        defaultCollapseLabel.style.opacity = "0.5";
      }
    });

    // 鼠标移出面板时，收起
    panel.addEventListener("mouseleave", function() {
      collapseSettingsPanel();
      });

    // 应用设置按钮事件
    document
      .getElementById("apply-settings-btn")
      .addEventListener("click", function () {
        // 获取设置值
        const hideAllFolder = document.getElementById(
          "setting-hide-all-folders"
        ).checked;
        const hideUnclassified = document.getElementById(
          "setting-hide-unclassified"
        ).checked;
        const floatingToc = document.getElementById(
          "setting-floating-toc"
        ).checked;
        const tocShowH1 = document.getElementById(
          "setting-toc-show-h1"
        ).checked;
        const tocShowH2 = document.getElementById(
          "setting-toc-show-h2"
        ).checked;
        const tocShowH3 = document.getElementById(
          "setting-toc-show-h3"
        ).checked;
        const collapseNoteList = document.getElementById(
          "setting-collapse-note-list"
        ).checked;
        const defaultCollapseNoteList = document.getElementById(
          "setting-default-collapse-note-list"
        ).checked;

        // 保存设置（如果不显示按钮，则默认折叠设置强制为false）
        const settings = {
          hideAllFolder,
          hideUnclassified,
          floatingToc,
          tocShowH1,
          tocShowH2,
          tocShowH3,
          collapseNoteList,
          defaultCollapseNoteList: collapseNoteList ? defaultCollapseNoteList : false,
        };

        saveSettings(settings).then(() => {
          // 应用隐藏设置
          hideSystemAndAll(hideAllFolder, hideUnclassified);
          
          // 延迟后再次应用，确保生效
          setTimeout(() => {
            hideSystemAndAll(hideAllFolder, hideUnclassified);
          }, 300);

          // 应用悬浮目录设置
          if (floatingToc) {
            createFloatingToc();
          } else {
            removeFloatingToc();
          }
          
          // 应用笔记列表折叠设置
          if (collapseNoteList) {
            setupNoteListCollapse(defaultCollapseNoteList);
          } else {
            removeNoteListCollapse();
          }

          // 显示已应用提示
          alert(
            `设置已应用\n隐藏全部笔记: ${
              hideAllFolder ? "开启 : "关闭"
            }\n隐藏未分类 ${hideUnclassified ? "开启 : "关闭"}\n悬浮目录: ${
              floatingToc ? "开启 : "关闭"
            }\n显示笔记列表折叠按钮: ${
              collapseNoteList ? "开启 : "关闭"
            }\n默认折叠笔记列表: ${
              defaultCollapseNoteList ? "开启 : "关闭"
            }`
          );

          // 收起面板
          collapseSettingsPanel();
          
          // 如果需要显示，刷新页面以重新显示被隐藏的元素
          if (!hideAllFolder || !hideUnclassified) {
            setTimeout(() => {
              location.reload();
            }, 500);
          }
        });
      });
  });
}

// 收起设置面板
function collapseSettingsPanel() {
  const panel = document.getElementById("mi-note-settings-panel");
  if (panel) {
    panel.remove();
  }
}

// 兼容旧代码：toggleSettingsPanel 函数保留但改为调用新函数
function toggleSettingsPanel() {
  const panel = document.getElementById("mi-note-settings-panel");
  if (panel) {
    collapseSettingsPanel();
  } else {
    expandSettingsPanel();
  }
}

// 保存设置到本地存储
function saveSettings(settings) {
  return new Promise((resolve) => {
    try {
      // 首先检查扩展上下文是否有效
      if (!isExtensionContextValid()) {
        console.warn("扩展上下文已失效，使用 localStorage");
        localStorage.setItem("miNoteSettings", JSON.stringify(settings));
        console.log("使用localStorage保存设置（扩展上下文失效）);
        resolve();
        return;
      }
      
      // 检查chrome.storage是否可用
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.sync
      ) {
        chrome.storage.sync.set({ miNoteSettings: settings }, function () {
          if (chrome.runtime.lastError) {
            console.error("chrome.storage error:", chrome.runtime.lastError);
          }
          console.log("设置已保存);
          resolve();
        });
      } else {
        // 如果chrome.storage不可用，使用localStorage
        localStorage.setItem("miNoteSettings", JSON.stringify(settings));
        console.log("使用localStorage保存设置（chrome.storage不可用）");
        resolve();
      }
    } catch (error) {
      console.error("保存设置时出错", error);
      resolve(); // 即使出错也继续执行
    }
  });
}

// 检查扩展上下文是否有效
function isExtensionContextValid() {
  try {
    // 尝试访问 chrome.runtime.id，如果上下文失效会抛出错误
    return !!(chrome && chrome.runtime && chrome.runtime.id);
  } catch (error) {
    return false;
  }
}

// 从本地存储加载设置
function loadSettings() {
  return new Promise((resolve) => {
    try {
      // 首先检查扩展上下文是否有效
      if (!isExtensionContextValid()) {
        console.warn("扩展上下文已失效，使用 localStorage");
        const savedSettings = localStorage.getItem("miNoteSettings");
        const settings = savedSettings
          ? { ...defaultSettings, ...JSON.parse(savedSettings) }
          : defaultSettings;
        resolve(settings);
        return;
      }
      
      // 检查chrome.storage是否可用，尝试从chrome.storage加载设置
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.sync
      ) {
        chrome.storage.sync.get("miNoteSettings", function (result) {
          // 检查是否有 chrome.runtime.lastError
          if (chrome.runtime.lastError) {
            console.error("chrome.storage error:", chrome.runtime.lastError);
            resolve(defaultSettings);
            return;
          }
          // 合并默认设置和已保存的设置（确保新字段有默认值）
          const settings = { ...defaultSettings, ...(result.miNoteSettings || {}) };
          console.log("从chrome.storage加载的设置", settings);
          resolve(settings);
          return;
        });
        return; // 确保不会继续执行下面的代码
      }

      // 如果chrome.storage不可用，使用localStorage
      const savedSettings = localStorage.getItem("miNoteSettings");
      const settings = savedSettings
        ? { ...defaultSettings, ...JSON.parse(savedSettings) }
        : defaultSettings;
      console.log(
        "从localStorage加载的设置（chrome.storage不可用）:",
        settings
      );
      resolve(settings);
    } catch (error) {
      console.error("加载设置时出错", error);
      resolve(defaultSettings);
    }
  });
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

// 获取所有侧边栏项目
function getAllSidebarItems() {
  try {
    const sidebarBody = findElementsByPartialClassName("sidebar-body");
    if (!sidebarBody.length) {
      console.log("未找到sidebar-body");
      return [];
    }
    const sidebarItems = sidebarBody[0].querySelectorAll('[class*="sidebar-item"]');
    return Array.from(sidebarItems);
  } catch (error) {
    console.error("获取侧边栏项目时出错:", error);
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
      console.log("找到有用暂存文件夹元素", item);
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
    console.log("点击有用暂存文件夹);
    folderElement.click();
    return true;
  } else {
    console.log("未找到有用暂存文件夹，无法点击);
    return false;
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
    const text = item.textContent.trim();
    if (hideAllFolder && text.includes("全部笔记")) {
      targetItems.push(item);
      console.log("找到并准备隐藏 全部笔记");
    }
    if (hideUnclassified && text.includes("未分类)) {
      targetItems.push(item);
      console.log("找到并准备隐藏 未分类);
    }
  });

  targetItems.forEach((item) => {
    item.style.display = "none";
    console.log("已隐藏", item.textContent.trim());
  });
}

// 全局变量：内容观察器和防抖计时器
let tocContentObserver = null;
let tocUpdateTimer = null;
let noteChangeObserver = null; // 监听笔记切换的观察器

// 创建悬浮目录
function createFloatingToc() {
  // 如果已存在，先移除
  removeFloatingToc();
  
  console.log("开始创建悬浮目录..");
  
  // 加载设置以获取过滤选项
  loadSettings().then((settings) => {
    // 首先尝试提取便签标题
    let headings = [];
    const noteTitle = document.querySelector('.title-textarea');
    if (noteTitle) {
      const titleText = noteTitle.textContent.trim();
      if (titleText) {
        headings.push({
          text: titleText,
          level: 1,
          element: noteTitle,
          isNoteTitle: true  // 标记为便签标题
        });
        console.log("找到便签标题:", titleText);
      }
    }
    
    // 查找笔记内容区域
    const noteContent = findNoteContentArea();
    if (noteContent) {
      console.log("找到笔记内容区域，继续提取内容中的标题);
      // 提取内容区域的标题
      const contentHeadings = extractHeadingsFromContent(noteContent);
      headings = headings.concat(contentHeadings);
      
      // 设置内容监听器，自动更新目录
      setupTocContentObserver(noteContent);
    } else {
      console.log("未找到笔记内容区域，仅使用便签标题);
    }
    
    // 根据设置过滤标题
    headings = headings.filter(h => {
      if (h.level === 1 && !settings.tocShowH1) return false;
      if (h.level === 2 && !settings.tocShowH2) return false;
      if (h.level === 3 && !settings.tocShowH3) return false;
      return true;
    });
    console.log(`应用标题级别过滤，剩余 ${headings.length} 个标题`);
    
    if (headings.length === 0) {
      console.log("未找到任何标题，无法创建目录");
      return;
    }
    
    console.log(`找到 ${headings.length} 个标题`);
    
    // 先创建收起状态的小图标
    createMinimizedTocIcon(headings);
    
    console.log("悬浮目录创建成功（默认收起状态）");
  });
}

// 设置内容观察器，监听笔记内容变化
function setupTocContentObserver(noteContent) {
  // 如果已存在观察器，先断开
  if (tocContentObserver) {
    tocContentObserver.disconnect();
  }
  
  // 创建 MutationObserver 监听内容变化
  tocContentObserver = new MutationObserver((mutations) => {
    // 使用防抖，避免频繁更新
    clearTimeout(tocUpdateTimer);
    tocUpdateTimer = setTimeout(() => {
      console.log("检测到内容变化，更新目录..");
      updateFloatingToc();
    }, 500); // 500ms 防抖延迟
  });
  
  // 开始观察
  tocContentObserver.observe(noteContent, {
    childList: true,        // 监听子节点的添加/删除
    subtree: true,          // 监听所有后代节点
    characterData: true,    // 监听文本内容变化
    attributes: true,       // 监听属性变化（如 class 变化）
    attributeFilter: ['class'] // 只监听 class 属性（标题级别可能通过 class 改变）
  });
  
  console.log("内容监听器已设置");
}

// 更新悬浮目录（保持当前展开/收起状态）
function updateFloatingToc() {
  // 加载设置以获取过滤选项
  loadSettings().then((settings) => {
    // 提取最新的标题
    let headings = [];
    const noteTitle = document.querySelector('.title-textarea');
    if (noteTitle) {
      const titleText = noteTitle.textContent.trim();
      if (titleText) {
        headings.push({
          text: titleText,
          level: 1,
          element: noteTitle,
          isNoteTitle: true
        });
      }
    }
    
    const noteContent = findNoteContentArea();
    if (noteContent) {
      const contentHeadings = extractHeadingsFromContent(noteContent);
      headings = headings.concat(contentHeadings);
    }
    
    // 根据设置过滤标题
    headings = headings.filter(h => {
      if (h.level === 1 && !settings.tocShowH1) return false;
      if (h.level === 2 && !settings.tocShowH2) return false;
      if (h.level === 3 && !settings.tocShowH3) return false;
      return true;
    });
    console.log(`应用标题级别过滤，剩余 ${headings.length} 个标题`);
    
    if (headings.length === 0) {
      console.log("没有标题，移除目录);
      removeFloatingToc();
      return;
    }
    
    // 检查当前是否有展开的完整目录
    const existingFullToc = document.getElementById("mi-note-floating-toc");
    const existingMinimized = document.getElementById("mi-note-toc-minimized");
    
    if (existingFullToc) {
      // 如果完整目录正在显示，不要移除它，只更新小图标的数据
      if (existingMinimized) {
        existingMinimized.remove();
        createMinimizedTocIcon(headings);
      }
      // 不移除完整目录，让它继续显示
    } else if (existingMinimized) {
      // 如果只有小图标，更新小图标的数据
      existingMinimized.remove();
      createMinimizedTocIcon(headings);
    } else {
      // 都不存在，创建新的
      createMinimizedTocIcon(headings);
    }
    
    console.log(`目录已更新：${headings.length} 个标题`);
  });
}

// 创建收起状态的目录图标
function createMinimizedTocIcon(headings) {
  // 先移除可能存在的图标
  const existingIcon = document.getElementById("mi-note-toc-minimized");
  if (existingIcon) {
    existingIcon.remove();
  }
  
  const minimizedIcon = document.createElement("div");
  minimizedIcon.id = "mi-note-toc-minimized";
  minimizedIcon.style.cssText = `
    position: fixed !important;
    top: 160px !important;
    right: 20px !important;
    width: 36px !important;
    height: 36px !important;
    background-color: #ff6700 !important;
    color: white !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 16px !important;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
    cursor: pointer !important;
    z-index: 9999998 !important;
    transition: all 0.3s ease !important;
    user-select: none !important;
  `;
  minimizedIcon.innerHTML = "📑";
  minimizedIcon.title = `目录 (${headings.length}▶`;
  
  // 存储标题数据
  minimizedIcon.dataset.headings = JSON.stringify(headings);
  
  // 悬停效果
  minimizedIcon.addEventListener("mouseenter", function() {
    this.style.transform = "scale(1.1)";
    this.style.boxShadow = "0 4px 16px rgba(0,0,0,0.3)";
    // 鼠标悬停时展开完整目录，从 dataset 读取最新的标题数据
    const latestHeadings = JSON.parse(this.dataset.headings || '[]');
    expandFullToc(latestHeadings);
  });
  
  minimizedIcon.addEventListener("mouseleave", function() {
    this.style.transform = "scale(1)";
    this.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
  });
  
  document.body.appendChild(minimizedIcon);
}

// 展开完整目录
function expandFullToc(headings) {
  // 如果完整目录已存在，不重复创建
  if (document.getElementById("mi-note-floating-toc")) {
    return;
  }
  
  // 创建目录容器
  const tocContainer = document.createElement("div");
  tocContainer.id = "mi-note-floating-toc";
  tocContainer.style.cssText = `
    position: fixed !important;
    top: 160px !important;
    right: 20px !important;
    width: 220px !important;
    max-height: 500px !important;
    background-color: rgba(255, 255, 255, 0.95) !important;
    border-radius: 8px !important;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15) !important;
    padding: 12px !important;
    z-index: 9999999 !important;
    font-family: 'Microsoft YaHei', sans-serif !important;
    overflow-y: auto !important;
    border: 2px solid #ff6700 !important;
  `;
  
  // 创建标题
  const tocTitle = document.createElement("div");
  tocTitle.style.cssText = `
    font-size: 14px !important;
    font-weight: bold !important;
    color: #ff6700 !important;
    margin-bottom: 10px !important;
    padding-bottom: 8px !important;
    border-bottom: 1px solid #f0f0f0 !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
  `;
  tocTitle.innerHTML = `
    <span>📑 目录 (${headings.length})</span>
  `;
  tocContainer.appendChild(tocTitle);
  
  // 创建目录列表
  const tocList = document.createElement("div");
  tocList.id = "mi-toc-list";
  tocList.style.cssText = `
    font-size: 13px !important;
    line-height: 1.6 !important;
  `;
  
  headings.forEach((heading, index) => {
    const tocItem = document.createElement("div");
    const indent = (heading.level - 1) * 12;
    tocItem.style.cssText = `
      padding: 4px 8px 4px ${8 + indent}px !important;
      cursor: pointer !important;
      color: #333 !important;
      border-radius: 4px !important;
      margin-bottom: 2px !important;
      transition: all 0.2s !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
    `;
    
    // 根据标题级别设置字体大小
    if (heading.level === 1) {
      tocItem.style.fontWeight = "bold";
      tocItem.style.fontSize = "13px";
    } else if (heading.level === 2) {
      tocItem.style.fontSize = "12px";
    } else {
      tocItem.style.fontSize = "11px";
      tocItem.style.color = "#666";
    }
    
    // 创建文本部分
    const textSpan = document.createElement("span");
    textSpan.style.cssText = `
      flex: 1 !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    `;
    textSpan.textContent = heading.text;
    tocItem.appendChild(textSpan);
    
    // 如果是便签标题，添加标识图标
    if (heading.isNoteTitle) {
      const icon = document.createElement("span");
      icon.style.cssText = `
        margin-left: 6px !important;
        font-size: 12px !important;
        flex-shrink: 0 !important;
      `;
      icon.textContent = "📄";
      icon.title = "便签标题";
      tocItem.appendChild(icon);
    }
    
    tocItem.title = heading.text;
    
    // 点击跳转
    tocItem.addEventListener("click", function() {
      // 重新查找元素（因为从 JSON 反序列化▶element 引用会丢失）
      let targetElement = null;
      if (heading.isNoteTitle) {
        // 如果是便签标题，查找 .title-textarea
        targetElement = document.querySelector(".title-textarea");
      } else {
        // 否则，根据文本内容在当前笔记内容区查▶
        const contentArea = findNoteContentArea();
        if (contentArea) {
          const allElements = contentArea.querySelectorAll("p, h1, h2, h3, h4, h5, h6");
          for (const el of allElements) {
            if (el.textContent.trim() === heading.text) {
              targetElement = el;
              break;
            }
          }
        }
      }
      
      // 执行滚动
      if (targetElement && typeof targetElement.scrollIntoView === 'function') {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      
      // 高亮当前▶
      tocList.querySelectorAll("div").forEach(item => {
        item.style.backgroundColor = "";
        const firstSpan = item.querySelector('span');
        if (firstSpan) {
          firstSpan.style.color = item.style.color.includes("666") ? "#666" : "#333";
        }
      });
      this.style.backgroundColor = "#fff3e0";
      const firstSpan = this.querySelector('span');
      if (firstSpan) {
        firstSpan.style.color = "#ff6700";
      }
    });
    
    // 悬停效果
    tocItem.addEventListener("mouseenter", function() {
      if (this.style.backgroundColor !== "rgb(255, 243, 224)") {
        this.style.backgroundColor = "#f5f5f5";
      }
    });
    
    tocItem.addEventListener("mouseleave", function() {
      if (this.style.backgroundColor !== "rgb(255, 243, 224)") {
        this.style.backgroundColor = "";
      }
    });
    
    tocList.appendChild(tocItem);
  });
  
  tocContainer.appendChild(tocList);
  document.body.appendChild(tocContainer);
  
  // 鼠标移出完整目录时，收起
  tocContainer.addEventListener("mouseleave", function() {
    collapseFullToc();
  });
}

// 收起完整目录
function collapseFullToc() {
  const tocContainer = document.getElementById("mi-note-floating-toc");
  if (tocContainer) {
    tocContainer.remove();
  }
}

// 移除悬浮目录（包括收起图标）
function removeFloatingToc() {
  const existingToc = document.getElementById("mi-note-floating-toc");
  if (existingToc) {
    existingToc.remove();
    console.log("已移除悬浮目▶);
  }
  const existingMinimized = document.getElementById("mi-note-toc-minimized");
  if (existingMinimized) {
    existingMinimized.remove();
    console.log("已移除收起的目录图标");
  }
  
  // 清理观察▶
  if (tocContentObserver) {
    tocContentObserver.disconnect();
    tocContentObserver = null;
    console.log("已清理内容观察器");
  }
  
  // 清理定时▶
  if (tocUpdateTimer) {
    clearTimeout(tocUpdateTimer);
    tocUpdateTimer = null;
  }
}

// 查找笔记内容区域
function findNoteContentArea() {
  // 优先查找小米便签的内容容▶
  const pmContainer = document.querySelector('.pm-container .ProseMirror');
  if (pmContainer) {
    console.log("找到笔记内容区域: .pm-container .ProseMirror", pmContainer);
    return pmContainer;
  }
  
  // 尝试查找其他可能的容▶
  const selectors = [
    '.pm-container',
    '.ProseMirror',
    '[class*="note-content"]',
    '[class*="editor-content"]',
    '[class*="rich-text"]',
    '[class*="ql-editor"]',
    '[class*="content-area"]',
    '[class*="editor"]',
    'article',
    '[role="textbox"]',
    '[contenteditable="true"]',
    'div[contenteditable]',
    '.content',
    '#content'
  ];
  
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      // 排除便签标题元素
      if (element.classList.contains('title-textarea')) {
        continue;
      }
      // 检查元素是否包含实际内▶
      if (element && element.textContent.trim().length > 10) {
        console.log("找到笔记内容区域:", selector, element);
        console.log("内容预览:", element.textContent.substring(0, 100));
        return element;
      }
    }
  }
  
  // 如果上述方法都失败，尝试查找最大的可编辑区▶
  const editableElements = document.querySelectorAll('[contenteditable="true"]');
  let largestElement = null;
  let maxLength = 0;
  
  editableElements.forEach(el => {
    // 排除便签标题元素
    if (el.classList.contains('title-textarea')) {
      return;
    }
    const length = el.textContent.trim().length;
    if (length > maxLength) {
      maxLength = length;
      largestElement = el;
    }
  });
  
  if (largestElement) {
    console.log("通过最大可编辑区域找到内容:", largestElement);
    console.log("内容长度:", maxLength);
    return largestElement;
  }
  
  console.error("未找到笔记内容区域，已尝试所有选择▶);
  return null;
}

// 提取标题
function extractHeadings(container) {
  const headings = [];
  
  console.log("开始提取标题，容器:", container);
  
  // 方法0: 首先查找小米便签的标▶
  const noteTitle = document.querySelector('.title-textarea');
  if (noteTitle) {
    const titleText = noteTitle.textContent.trim();
    if (titleText) {
      headings.push({
        text: titleText,
        level: 1,
        element: noteTitle,
        isNoteTitle: true  // 标记为便签标题
      });
      console.log("找到便签标题:", titleText);
    }
  }
  
  // 提取内容中的标题
  const contentHeadings = extractHeadingsFromContent(container);
  return headings.concat(contentHeadings);
}

// 从内容区域提取标题（不包括便签标题）
function extractHeadingsFromContent(container) {
  const headings = [];
  
  // 方法0: 优先查找小米便签的标题格▶(pm-size-* 类名)
  const pmSizeElements = container.querySelectorAll('p[class*="pm-size-"]');
  console.log("找到pm-size-*元素数量:", pmSizeElements.length);
  
  pmSizeElements.forEach((element) => {
    const text = element.textContent.trim();
    if (text && !element.classList.contains('title-textarea')) {
      let level = 3; // 默认▶h3
      
      // 根据 pm-size 类名判断级别
      if (element.classList.contains('pm-size-large')) {
        level = 1; // pm-size-large 对应 h1
      } else if (element.classList.contains('pm-size-middle')) {
        level = 2; // pm-size-middle 对应 h2
      } else if (element.classList.contains('pm-size-h3')) {
        level = 3; // pm-size-h3 对应 h3
      }
      
      headings.push({
        text: text,
        level: level,
        element: element
      });
      console.log(`小米便签标题 (pm-size) H${level}:`, text);
    }
  });
  
  // 方法1: 查找真实▶h1, h2, h3 标签
  const htmlHeadings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");
  console.log("找到HTML标题标签数量:", htmlHeadings.length);
  
  htmlHeadings.forEach((element) => {
    const text = element.textContent.trim();
    if (text) {
      // 避免重复添加
      const alreadyAdded = headings.some(h => h.text === text && h.element === element);
      if (!alreadyAdded) {
        const level = parseInt(element.tagName.substring(1));
        headings.push({
          text: text,
          level: level > 3 ? 3 : level,
          element: element
        });
        console.log(`HTML标题 H${level}:`, text);
      }
    }
  });
  
  // 方法2: 查找具有标题样式的元素（作为后备方案▶
  if (headings.length === 0) {
    const possibleHeadingSelectors = [
      '[class*="heading"]',
      '[class*="title"]',
      '[data-level]',
      'p[style*="font-size"][style*="bold"]',
      'div[style*="font-size"][style*="bold"]',
      'span[style*="font-size"][style*="bold"]'
    ];
    
    possibleHeadingSelectors.forEach(selector => {
      try {
        const elements = container.querySelectorAll(selector);
        console.log(`查找选择▶${selector}:`, elements.length);
        
        elements.forEach(element => {
          const text = element.textContent.trim();
          // 避免把便签标题重复添▶
          if (text && text.length > 0 && text.length < 100 && 
              !element.classList.contains('title-textarea')) {
            // 避免重复添加
            const alreadyAdded = headings.some(h => h.text === text && h.element === element);
            if (!alreadyAdded) {
              // 尝试判断标题级别
              const level = determineHeadingLevel(element);
              headings.push({
                text: text,
                level: level,
                element: element
              });
              console.log(`样式标题 L${level}:`, text);
            }
          }
        });
      } catch (e) {
        console.error("查找标题时出▶", selector, e);
      }
    });
  }
  
  // 方法3: 根据字体大小查找可能的标题（作为后备方案▶
  if (headings.length === 0) {
    console.log("尝试根据字体大小查找标题...");
    const allElements = container.querySelectorAll('p, div, span');
    
    allElements.forEach(element => {
      const text = element.textContent.trim();
      // 排除便签标题
      if (element.classList.contains('title-textarea')) {
        return;
      }
      
      const style = window.getComputedStyle(element);
      const fontSize = parseFloat(style.fontSize);
      const fontWeight = style.fontWeight;
      
      // 如果字体较大或加粗，可能是标▶
      if (text && text.length > 0 && text.length < 100 && 
          (fontSize > 16 || fontWeight === 'bold' || parseInt(fontWeight) >= 600)) {
        
        const alreadyAdded = headings.some(h => h.text === text);
        if (!alreadyAdded) {
          const level = fontSize > 20 ? 2 : (fontSize > 18 ? 2 : 3);
          headings.push({
            text: text,
            level: level,
            element: element
          });
          console.log(`字体标题 (${fontSize}px, ${fontWeight}) L${level}:`, text);
        }
      }
    });
  }
  
  console.log(`从内容提取到 ${headings.length} 个标题`);
  return headings;
}

// 判断标题级别
function determineHeadingLevel(element) {
  // 检查data属▶
  const dataLevel = element.getAttribute('data-level');
  if (dataLevel) {
    return parseInt(dataLevel);
  }
  
  // 检查小米便签的 pm-size 类名
  const className = element.className || '';
  if (className.includes('pm-size-large')) return 1;
  if (className.includes('pm-size-middle')) return 2;
  if (className.includes('pm-size-h3')) return 3;
  
  // 检查标准类▶
  if (className.includes('h1') || className.includes('heading-1')) return 1;
  if (className.includes('h2') || className.includes('heading-2')) return 2;
  if (className.includes('h3') || className.includes('heading-3')) return 3;
  
  // 根据字体大小判断
  const style = window.getComputedStyle(element);
  const fontSize = parseFloat(style.fontSize);
  
  if (fontSize > 20) return 1;
  if (fontSize > 18) return 2;
  return 3;
}

// 设置笔记列表折叠功能
function setupNoteListCollapse(isDefaultCollapsed) {
  // 移除旧的按钮（如果存在）
  removeNoteListCollapse();
  
  // 创建控制按钮（在笔记主体左侧▶
  createNoteListCollapseButton(isDefaultCollapsed);
  
  console.log("笔记列表折叠功能已启用，默认折叠状▶", isDefaultCollapsed);
}

// 创建折叠控制按钮
function createNoteListCollapseButton(isDefaultCollapsed) {
  // 查找笔记列表区域
  const noteList = document.querySelector('[class*="note-list-"]');
  if (!noteList) {
    console.log("未找到笔记列表区域，1秒后重试");
    setTimeout(() => createNoteListCollapseButton(isDefaultCollapsed), 1000);
    return;
  }
  
  // 如果按钮已存在，不重复创建
  if (document.getElementById("mi-note-list-collapse-btn")) {
    return;
  }
  
  // 获取笔记列表的宽度和位置
  const noteListRect = noteList.getBoundingClientRect();
  
  // 创建按钮
  const collapseBtn = document.createElement("div");
  collapseBtn.id = "mi-note-list-collapse-btn";
  collapseBtn.innerHTML = "▶; // 默认显示向右箭头
  collapseBtn.style.cssText = `
    position: fixed !important;
    left: 245px !important;
    top: 89px !important;
    transform: translateY(-50%) !important;
    width: 20px !important;
    height: 40px !important;
    background: #fff !important;
    border: 1px solid #ddd !important;
    border-radius: 6px !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 12px !important;
    color: #666 !important;
    z-index: 9999 !important;
    box-shadow: 0 2px 6px rgba(0,0,0,0.12) !important;
    transition: all 0.3s ease !important;
  `;
  collapseBtn.title = "折叠/展开笔记列表";
  collapseBtn.setAttribute("data-collapsed", "false");
  
  // 鼠标悬停效果
  collapseBtn.addEventListener("mouseenter", function() {
    this.style.background = "#f5f5f5";
  });
  
  collapseBtn.addEventListener("mouseleave", function() {
    this.style.background = "#fff";
  });
  
  // 点击事件
  collapseBtn.addEventListener("click", function() {
    toggleNoteListCollapse();
  });
  
  document.body.appendChild(collapseBtn);
  console.log("笔记列表折叠按钮已创建，位置：left=245px, top=89px");
  
  // 如果设置了默认折叠，则自动执行折▶
  if (isDefaultCollapsed) {
    setTimeout(() => {
      toggleNoteListCollapse();
    }, 500);
  }
}

// 切换笔记列表折叠状▶
function toggleNoteListCollapse() {
  const collapseBtn = document.getElementById("mi-note-list-collapse-btn");
  const noteList = document.querySelector('[class*="note-list-"]');
  const noteContent = document.querySelector('[class*="note-content"]');
  
  if (!collapseBtn || !noteList || !noteContent) {
    console.log("未找到必要的DOM元素");
    return;
  }
  
  const isCollapsed = collapseBtn.getAttribute("data-collapsed") === "true";
  
  if (isCollapsed) {
    // 展开笔记列表
    noteList.style.display = "";
    noteList.style.width = "";
    noteContent.style.marginLeft = "";
    noteContent.style.width = "";
    collapseBtn.innerHTML = "◀";
    collapseBtn.setAttribute("data-collapsed", "false");
    // 按钮位置保持不变，固定在笔记列表右侧
  } else {
    // 折叠笔记列表
    noteList.style.display = "none";
    noteContent.style.marginLeft = "0";
    noteContent.style.width = "100%";
    collapseBtn.innerHTML = "▶;
    collapseBtn.setAttribute("data-collapsed", "true");
    // 按钮位置保持不变，固定在原位▶
  }
}

// 移除笔记列表折叠功能
function removeNoteListCollapse() {
  const collapseBtn = document.getElementById("mi-note-list-collapse-btn");
  if (collapseBtn) {
    collapseBtn.remove();
  }
  
  // 恢复原始样式
  const noteList = document.querySelector('[class*="note-list-"]');
  const noteContent = document.querySelector('[class*="note-content"]');
  
  if (noteList) {
    noteList.style.display = "";
    noteList.style.width = "";
  }
  
  if (noteContent) {
    noteContent.style.marginLeft = "";
    noteContent.style.width = "";
  }
  
  console.log("笔记列表折叠功能已移▶);
}

// 打开文件夹管理对话框
function openFolderManagementDialog() {
  // 如果对话框已存在，先移除
  const existingDialog = document.getElementById("mi-folder-management-dialog");
  if (existingDialog) {
    existingDialog.remove();
  }
  
  // 创建遮罩▶
  const overlay = document.createElement("div");
  overlay.id = "mi-folder-management-dialog";
  overlay.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: rgba(0, 0, 0, 0.5) !important;
    z-index: 99999999 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  `;
  
  // 创建对话▶
  const dialog = document.createElement("div");
  dialog.style.cssText = `
    background: white !important;
    border-radius: 8px !important;
    padding: 20px !important;
    width: 400px !important;
    max-height: 600px !important;
    overflow-y: auto !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
  `;
  
  // 获取所有文件夹
  const folders = getAllFolders();
  
  // 加载当前设置
  loadSettings().then((settings) => {
    const customVisibility = settings.customFolderVisibility || {};
    
    dialog.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="margin: 0; color: #333; font-size: 16px;">管理笔记目录显示</h3>
        <button id="close-folder-dialog" style="
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
          line-height: 1;
        ">×</button>
      </div>
      
      <div style="margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 4px; font-size: 13px; color: #666;">
        💡 提示：勾选表示显示该目录，取消勾选表示隐▶
      </div>
      
      <div id="folder-list" style="margin-bottom: 20px;">
        ${folders.map(folder => `
          <label style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
            <span style="color: #333; font-size: 14px;">${folder}</span>
            <input type="checkbox" class="folder-visibility-checkbox" data-folder="${folder}" 
              ${customVisibility[folder] !== false ? "checked" : ""} 
              style="width: 18px; height: 18px;">
          </label>
        `).join('')}
      </div>
      
      <div style="display: flex; gap: 10px;">
        <button id="save-folder-visibility" style="
          flex: 1;
          background-color: #ff6700;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        ">保存</button>
        <button id="cancel-folder-dialog" style="
          flex: 1;
          background-color: #ccc;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        ">取消</button>
      </div>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    // 关闭按钮事件
    document.getElementById("close-folder-dialog").addEventListener("click", function() {
      overlay.remove();
    });
    
    document.getElementById("cancel-folder-dialog").addEventListener("click", function() {
      overlay.remove();
    });
    
    // 点击遮罩层关▶
    overlay.addEventListener("click", function(e) {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
    
    // 保存按钮事件
    document.getElementById("save-folder-visibility").addEventListener("click", function() {
      const checkboxes = document.querySelectorAll(".folder-visibility-checkbox");
      const newVisibility = {};
      
      checkboxes.forEach(checkbox => {
        const folderName = checkbox.getAttribute("data-folder");
        newVisibility[folderName] = checkbox.checked;
      });
      
      // 保存设置
      settings.customFolderVisibility = newVisibility;
      saveSettings(settings).then(() => {
        alert("文件夹显示设置已保存！刷新页面后生效▶);
        overlay.remove();
        // 应用设置
        applyCustomFolderVisibility(newVisibility);
      });
    });
  });
}

// 获取所有文件夹名称
function getAllFolders() {
  const folders = [];
  const folderContainerArray = findElementsByPartialClassName(folderListContainerClassName);
  
  if (!folderContainerArray.length) {
    console.log("未找到文件夹容器");
    return folders;
  }
  
  const sidebarItems = folderContainerArray[0].querySelectorAll('[class*="sidebar-item"]');
  
  sidebarItems.forEach((item) => {
    const text = item.textContent.trim();
    if (text && !folders.includes(text)) {
      folders.push(text);
    }
  });
  
  return folders;
}

// 应用自定义文件夹显示设置
function applyCustomFolderVisibility(customVisibility) {
  if (!customVisibility || Object.keys(customVisibility).length === 0) {
    return;
  }
  
  const folderContainerArray = findElementsByPartialClassName(folderListContainerClassName);
  
  if (!folderContainerArray.length) {
    console.log("未找到文件夹容器▶秒后重试");
    setTimeout(() => applyCustomFolderVisibility(customVisibility), 1000);
    return;
  }
  
  const sidebarItems = folderContainerArray[0].querySelectorAll('[class*="sidebar-item"]');
  
  sidebarItems.forEach((item) => {
    const text = item.textContent.trim();
    if (customVisibility.hasOwnProperty(text)) {
      if (customVisibility[text] === false) {
        item.style.display = "none";
      } else {
        item.style.display = "";
      }
    }
  });
  
  console.log("已应用自定义文件夹显示设▶);
}

// 设置笔记切换监听器
function setupNoteChangeObserver() {
  
  // 策略：监听笔记列表区域的点击事件
  // 小米便签的笔记列表在 .note-list-items ▶
  const noteListContainer = document.querySelector('[class*="note-list-items"]');
  
  if (!noteListContainer) {
    setTimeout(() => setupNoteChangeObserver(), 1000);
    return;
  }
  
  
  // 使用事件委托监听所有笔记项的点▶
  noteListContainer.addEventListener('click', function(e) {
    // 查找最近的笔记项元▶
    const noteItem = e.target.closest('[class*="note-item"]');
    if (noteItem) {
      console.log("检测到笔记点击");
      // 延迟一下，确保新笔记内容已加载
      setTimeout(() => {
        createFloatingToc();
      }, 800);
    }
  }, true); // 使用捕获阶段确保能捕获到事件
  
}

