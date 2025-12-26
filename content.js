// 使用多种方法确保按钮被添加到页面
window.addEventListener("load", initFunc);

const folderListContainerClassName = "expanded-content";

// 默认设置
const defaultSettings = {
  darkMode: false,
  hideAllFolder: true,
  hideUnclassified: true, // 添加未分类隐藏设置
  floatingToc: false, // 悬浮目录功能
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
  console.log("handleSetting被调用，设置:", settings);
  
  // 立即尝试隐藏
  hideSystemAndAll(settings.hideAllFolder, settings.hideUnclassified);
  
  // 延迟后再次尝试（DOM可能还未完全加载）
  setTimeout(() => {
    console.log("延迟500ms后再次尝试隐藏");
    hideSystemAndAll(settings.hideAllFolder, settings.hideUnclassified);
  }, 500);
  
  setTimeout(() => {
    console.log("延迟1500ms后再次尝试隐藏");
    hideSystemAndAll(settings.hideAllFolder, settings.hideUnclassified);
  }, 1500);
  
  // 应用悬浮目录设置
  if (settings.floatingToc) {
    setTimeout(() => {
      createFloatingToc();
    }, 1500);
    // 再次尝试，确保内容已加载
    setTimeout(() => {
      createFloatingToc();
    }, 3000);
  }
  
  // 自动打开有用暂存文件夹
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
          <span style="color: #333;">隐藏全部笔记</span>
          <input type="checkbox" id="setting-hide-all-folders" style="width: 18px; height: 18px;" ${
            settings.hideAllFolder ? "checked" : ""
          }>
        </label>

        <label style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
          <span style="color: #333;">隐藏未分类</span>
          <input type="checkbox" id="setting-hide-unclassified" style="width: 18px; height: 18px;" ${
            settings.hideUnclassified ? "checked" : ""
          }>
        </label>

        <label style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
          <span style="color: #333;">悬浮目录</span>
          <input type="checkbox" id="setting-floating-toc" style="width: 18px; height: 18px;" ${
            settings.floatingToc ? "checked" : ""
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
        const hideAllFolder = document.getElementById(
          "setting-hide-all-folders"
        ).checked;
        const hideUnclassified = document.getElementById(
          "setting-hide-unclassified"
        ).checked;
        const floatingToc = document.getElementById(
          "setting-floating-toc"
        ).checked;

        // 保存设置
        const settings = {
          darkMode,
          hideAllFolder,
          hideUnclassified,
          floatingToc,
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

          // 显示已应用提示
          alert(
            `设置已应用!\n隐藏全部笔记: ${
              hideAllFolder ? "开启" : "关闭"
            }\n隐藏未分类: ${hideUnclassified ? "开启" : "关闭"}\n悬浮目录: ${
              floatingToc ? "开启" : "关闭"
            }`
          );

          // 隐藏面板
          panel.style.display = "none";
          
          // 如果需要显示，刷新页面以重新显示被隐藏的元素
          if (!hideAllFolder || !hideUnclassified) {
            setTimeout(() => {
              location.reload();
            }, 100);
          }
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
          const settings = result.miNoteSettings || defaultSettings;
          console.log("从chrome.storage加载的设置:", settings);
          resolve(settings);
          return;
        });
        return; // 确保不会继续执行下面的代码
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
    } catch (error) {
      console.error("加载设置时出错:", error);
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
      console.log("找到并准备隐藏: 全部笔记");
    }
    if (hideUnclassified && text.includes("未分类")) {
      targetItems.push(item);
      console.log("找到并准备隐藏: 未分类");
    }
  });

  targetItems.forEach((item) => {
    item.style.display = "none";
    console.log("已隐藏:", item.textContent.trim());
  });
}

// 创建悬浮目录
function createFloatingToc() {
  // 如果已存在，先移除
  removeFloatingToc();
  
  console.log("开始创建悬浮目录...");
  
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
    console.log("找到笔记内容区域，继续提取内容中的标题");
    // 提取内容区域的标题
    const contentHeadings = extractHeadingsFromContent(noteContent);
    headings = headings.concat(contentHeadings);
  } else {
    console.log("未找到笔记内容区域，仅使用便签标题");
  }
  
  if (headings.length === 0) {
    console.log("未找到任何标题，无法创建目录");
    return;
  }
  
  console.log(`找到 ${headings.length} 个标题`);
  
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
    z-index: 9999997 !important;
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
    <div>
      <span id="mi-toc-refresh-btn" style="cursor: pointer; color: #ff6700; font-size: 14px; margin-right: 8px;" title="刷新目录">🔄</span>
      <span id="mi-toc-close-btn" style="cursor: pointer; color: #999; font-size: 16px;" title="关闭">×</span>
    </div>
  `;
  tocContainer.appendChild(tocTitle);
  
  // 创建目录列表
  const tocList = document.createElement("div");
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
    
    tocItem.title = heading.text; // 添加完整标题作为提示
    
    // 点击跳转
    tocItem.addEventListener("click", function() {
      heading.element.scrollIntoView({ behavior: "smooth", block: "start" });
      // 高亮当前项
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
  
  // 刷新按钮事件
  document.getElementById("mi-toc-refresh-btn").addEventListener("click", function() {
    console.log("手动刷新目录");
    createFloatingToc();
  });
  
  // 关闭按钮事件
  document.getElementById("mi-toc-close-btn").addEventListener("click", function() {
    removeFloatingToc();
  });
  
  console.log("悬浮目录创建成功");
}

// 移除悬浮目录
function removeFloatingToc() {
  const existingToc = document.getElementById("mi-note-floating-toc");
  if (existingToc) {
    existingToc.remove();
    console.log("已移除悬浮目录");
  }
}

// 查找笔记内容区域
function findNoteContentArea() {
  // 优先查找小米便签的内容容器
  const pmContainer = document.querySelector('.pm-container .ProseMirror');
  if (pmContainer) {
    console.log("找到笔记内容区域: .pm-container .ProseMirror", pmContainer);
    return pmContainer;
  }
  
  // 尝试查找其他可能的容器
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
      // 检查元素是否包含实际内容
      if (element && element.textContent.trim().length > 10) {
        console.log("找到笔记内容区域:", selector, element);
        console.log("内容预览:", element.textContent.substring(0, 100));
        return element;
      }
    }
  }
  
  // 如果上述方法都失败，尝试查找最大的可编辑区域
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
  
  console.error("未找到笔记内容区域，已尝试所有选择器");
  return null;
}

// 提取标题
function extractHeadings(container) {
  const headings = [];
  
  console.log("开始提取标题，容器:", container);
  
  // 方法0: 首先查找小米便签的标题
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
  
  // 方法0: 优先查找小米便签的标题格式 (pm-size-* 类名)
  const pmSizeElements = container.querySelectorAll('p[class*="pm-size-"]');
  console.log("找到pm-size-*元素数量:", pmSizeElements.length);
  
  pmSizeElements.forEach((element) => {
    const text = element.textContent.trim();
    if (text && !element.classList.contains('title-textarea')) {
      let level = 3; // 默认为 h3
      
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
  
  // 方法1: 查找真实的 h1, h2, h3 标签
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
  
  // 方法2: 查找具有标题样式的元素（作为后备方案）
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
        console.log(`查找选择器 ${selector}:`, elements.length);
        
        elements.forEach(element => {
          const text = element.textContent.trim();
          // 避免把便签标题重复添加
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
        console.error("查找标题时出错:", selector, e);
      }
    });
  }
  
  // 方法3: 根据字体大小查找可能的标题（作为后备方案）
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
      
      // 如果字体较大或加粗，可能是标题
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
  // 检查data属性
  const dataLevel = element.getAttribute('data-level');
  if (dataLevel) {
    return parseInt(dataLevel);
  }
  
  // 检查小米便签的 pm-size 类名
  const className = element.className || '';
  if (className.includes('pm-size-large')) return 1;
  if (className.includes('pm-size-middle')) return 2;
  if (className.includes('pm-size-h3')) return 3;
  
  // 检查标准类名
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
