document.addEventListener("DOMContentLoaded", function () {
  checkAdminAuth();
  setupTabs();
  setupEventListeners();
  loadInquiries();
  loadBlogPosts();
  loadProducts();
});

/* ---------------- HELPER FUNCTIONS ---------------- */
function formatDateDDMMYYYY(dateString) {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (e) {
    console.error("Date formatting error:", e);
    return "Invalid Date";
  }
}

function formatDateTime(dateString) {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  } catch (e) {
    console.error("DateTime formatting error:", e);
    return "Invalid Date";
  }
}

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
    .trim('-');
}

/* ---------------- AUTH ---------------- */
function checkAdminAuth() {
  fetch("php/check-auth.php")
    .then((r) => r.json())
    .then((data) => {
      if (!data.authenticated) {
        window.location.href = "admin-login.html";
      }
    })
    .catch(() => {
      window.location.href = "admin-login.html";
    });
}

function logoutAdmin() {
  fetch("php/logout.php")
    .then((r) => r.json())
    .then((data) => {
      if (data.success) {
        window.location.href = "admin-login.html";
      }
    })
    .catch((err) => console.error("Logout error:", err));
}

/* ---------------- TABS ---------------- */
function setupTabs() {
  document.querySelectorAll(".admin-tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      document
        .querySelectorAll(".admin-tab, .tab-content")
        .forEach((el) => el.classList.remove("active"));
      this.classList.add("active");
      document
        .getElementById(`${this.dataset.tab}-tab`)
        .classList.add("active");

      if (this.dataset.tab === "uploads") {
        loadUploads();
      }
    });
  });

  const defaultTab = document.querySelector(".admin-tab.active");
  if (defaultTab && defaultTab.dataset.tab === "uploads") {
    loadUploads();
  }
}

/* ---------------- EVENT LISTENERS ---------------- */
function setupEventListeners() {
  document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    logoutAdmin();
  });

  document.getElementById("addPostBtn").addEventListener("click", () => {
    const formContainer = document.getElementById("postForm");
    const formElement = document.getElementById("blogPostForm");
    formElement.reset();
    formContainer.style.display = "block";
    document.getElementById("formTitle").textContent = "Add New Blog Post";
    document.getElementById("postId").value = "";
    document.getElementById("postImage").dataset.existingImage = "";
    document.getElementById("imagePreview").style.display = "none";
    
    // Hide any inline edit forms
    document.querySelectorAll('.inline-edit-form').forEach(form => {
      form.style.display = 'none';
      form.classList.remove('active');
    });
  });

  document.getElementById("addProductBtn").addEventListener("click", () => {
    const formContainer = document.getElementById("productForm");
    const formElement = document.getElementById("productPostForm");
    formElement.reset();
    formContainer.style.display = "block";
    document.getElementById("productFormTitle").textContent = "Add New Product";
    document.getElementById("productId").value = "";
    document.getElementById("productImage").dataset.existingImage = "";
    document.getElementById("productImagePreview").style.display = "none";
    document.getElementById("productVideo").dataset.existingVideo = "";
    document.getElementById("productVideoPreview").style.display = "none";
    
    // Hide any inline edit forms
    document.querySelectorAll('.inline-edit-form').forEach(form => {
      form.style.display = 'none';
      form.classList.remove('active');
    });
  });

  document.getElementById("cancelBtn").addEventListener("click", () => {
    document.getElementById("postForm").style.display = "none";
  });

  document.getElementById("cancelProductBtn").addEventListener("click", () => {
    document.getElementById("productForm").style.display = "none";
  });

  // Auto-generate slug from title (Blog)
  document.getElementById("postTitle").addEventListener("input", function() {
    const title = this.value.trim();
    const slugInput = document.getElementById("postSlug");
    const postId = document.getElementById("postId").value;
    
    // Only auto-generate if it's a new post (no ID) or slug is empty
    if ((!postId || slugInput.value === '') && title) {
      slugInput.value = generateSlug(title);
    }
  });

  // Auto-generate slug from title (Product) - ADDED
  document.getElementById("productTitle").addEventListener("input", function() {
    const title = this.value.trim();
    const slugInput = document.getElementById("productSlug");
    const productId = document.getElementById("productId").value;
    
    // Only auto-generate if it's a new product (no ID) or slug is empty
    if ((!productId || slugInput.value === '') && title) {
      slugInput.value = generateSlug(title);
    }
  });

  document.getElementById("postImage").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      document.getElementById("previewImage").src = event.target.result;
      document.getElementById("imagePreview").style.display = "block";
    };
    reader.readAsDataURL(file);
  });

  document
    .getElementById("productImage")
    .addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        document.getElementById("previewProductImage").src =
          event.target.result;
        document.getElementById("productImagePreview").style.display = "block";
      };
      reader.readAsDataURL(file);
    });

  document
    .getElementById("productVideo")
    .addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;
      
      // Check file size client-side (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        alert(`Video file is too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum 50MB allowed.`);
        this.value = ''; // Clear the file input
        return;
      }
      
      // Check file type
      const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/webm'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please select a valid video file (MP4, MOV, AVI, WMV, WEBM).');
        this.value = ''; // Clear the file input
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        document.getElementById("previewProductVideo").src = event.target.result;
        document.getElementById("productVideoPreview").style.display = "block";
      };
      reader.readAsDataURL(file);
    });

  document
    .getElementById("deleteImageBtn")
    .addEventListener("click", async () => {
      const existingImage =
        document.getElementById("postImage").dataset.existingImage;
      const postId = document.getElementById("postId").value;

      if (!existingImage) {
        alert("No image to delete.");
        return;
      }

      if (!confirm("Are you sure you want to delete this image?")) return;

      try {
        const res = await fetch("php/delete-file.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `filePath=${encodeURIComponent(
            existingImage
          )}&postId=${encodeURIComponent(postId)}`,
        });
        const data = await res.json();
        if (data.success) {
          alert("Image deleted successfully.");
          document.getElementById("previewImage").src = "";
          document.getElementById("imagePreview").style.display = "none";
          document.getElementById("postImage").dataset.existingImage = "";
        } else {
          alert(data.error || "Failed to delete image.");
        }
      } catch (err) {
        console.error("Delete image error:", err);
        alert("Error deleting image.");
      }
    });

  document
    .getElementById("deleteProductImageBtn")
    .addEventListener("click", async () => {
      const existingImage =
        document.getElementById("productImage").dataset.existingImage;
      const productId = document.getElementById("productId").value;

      if (!existingImage) {
        alert("No image to delete.");
        return;
      }

      if (!confirm("Are you sure you want to delete this image?")) return;

      try {
        const res = await fetch("php/delete-file.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `filePath=${encodeURIComponent(
            existingImage
          )}&productId=${encodeURIComponent(productId)}`,
        });
        const data = await res.json();
        if (data.success) {
          alert("Image deleted successfully.");
          document.getElementById("previewProductImage").src = "";
          document.getElementById("productImagePreview").style.display = "none";
          document.getElementById("productImage").dataset.existingImage = "";
        } else {
          alert(data.error || "Failed to delete image.");
        }
      } catch (err) {
        console.error("Delete image error:", err);
        alert("Error deleting image.");
      }
    });

  document
    .getElementById("deleteProductVideoBtn")
    .addEventListener("click", async () => {
      const existingVideo =
        document.getElementById("productVideo").dataset.existingVideo;
      const productId = document.getElementById("productId").value;

      if (!existingVideo) {
        alert("No video to delete.");
        return;
      }

      if (!confirm("Are you sure you want to delete this video?")) return;

      try {
        const res = await fetch("php/delete-file.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `filePath=${encodeURIComponent(
            existingVideo
          )}&productId=${encodeURIComponent(productId)}`,
        });
        const data = await res.json();
        if (data.success) {
          alert("Video deleted successfully.");
          document.getElementById("previewProductVideo").src = "";
          document.getElementById("productVideoPreview").style.display = "none";
          document.getElementById("productVideo").dataset.existingVideo = "";
        } else {
          alert(data.error || "Failed to delete video.");
        }
      } catch (err) {
        console.error("Delete video error:", err);
        alert("Error deleting video.");
      }
    });

  document
    .getElementById("blogPostForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      await saveBlogPost();
    });

  document
    .getElementById("productPostForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      await saveProduct();
    });

  document
    .getElementById("downloadInquiriesBtn")
    .addEventListener("click", () => {
      const start = document.getElementById("startDate").value;
      const end = document.getElementById("endDate").value;
      const status = document.getElementById("statusFilter").value;

      let url = `php/download-inquiries.php?`;
      if (start) url += `start=${encodeURIComponent(start)}&`;
      if (end) url += `end=${encodeURIComponent(end)}&`;
      if (status) url += `status=${encodeURIComponent(status)}&`;

      window.open(url, "_blank");
    });

  // Uploads tab
  const uploadBtn = document.getElementById("uploadNewFileBtn");
  if (uploadBtn) {
    uploadBtn.addEventListener("click", () => {
      const fileInput = document.getElementById("newUploadFile");
      const file = fileInput.files[0];
      if (!file) return alert("Please select a file");
      const formData = new FormData();
      formData.append("file", file);
      fetch("php/upload-file.php", { method: "POST", body: formData })
        .then((r) => r.json())
        .then((res) => {
          if (res.success) {
            alert("File uploaded");
            fileInput.value = "";
            loadUploads();
          } else {
            alert(res.error);
          }
        });
    });
  }

  // Quick filter event listeners
  document.getElementById("quickDateFilter").addEventListener("change", function() {
    const filter = this.value;
    const status = document.getElementById("quickStatusFilter").value;
    
    if (filter === "custom") {
      document.getElementById("quickStartDate").style.display = "inline-block";
      document.getElementById("quickEndDate").style.display = "inline-block";
      document.getElementById("applyQuickDate").style.display = "inline-block";
      
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      document.getElementById("quickStartDate").value = yesterdayStr;
      document.getElementById("quickEndDate").value = today;
    } else {
      document.getElementById("quickStartDate").style.display = "none";
      document.getElementById("quickEndDate").style.display = "none";
      document.getElementById("applyQuickDate").style.display = "none";
      loadInquiries(filter, "", "", status);
    }
  });

  document.getElementById("quickStatusFilter").addEventListener("change", function() {
    const filter = document.getElementById("quickDateFilter").value;
    const status = this.value;
    if (filter === "custom") return;
    loadInquiries(filter, "", "", status);
  });

  document.getElementById("applyQuickDate").addEventListener("click", function() {
    const start = document.getElementById("quickStartDate").value;
    const end = document.getElementById("quickEndDate").value;
    const status = document.getElementById("quickStatusFilter").value;
    
    if (!start || !end) {
      alert("Please select both start and end dates");
      return;
    }
    
    if (new Date(start) > new Date(end)) {
      alert("Start date cannot be after end date");
      return;
    }
    
    loadInquiries("custom", start, end, status);
  });
}

/* ---------------- INQUIRIES ---------------- */
function loadInquiries(filter = "", start = "", end = "", status = "") {
  const tbody = document.querySelector("#inquiries-table tbody");
  tbody.innerHTML = "<tr><td colspan='10' style='text-align:center;padding:20px;'>Loading inquiries...</td></tr>";

  let url = `php/get-inquiries.php?filter=${filter}&status=${status}`;
  if (filter === "custom") {
    url += `&start=${start}&end=${end}`;
  }

  fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error('Network response was not ok');
      return r.json();
    })
    .then((data) => {
      if (data.message) {
        tbody.innerHTML = `<tr><td colspan='10' style='text-align:center;padding:20px;'>${data.message}</td></tr>`;
        return;
      }

      tbody.innerHTML = "";

      data.forEach((inquiry) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${inquiry.id}</td>
          <td>${inquiry.name}</td>
          <td>${inquiry.company}</td>
          <td>${inquiry.email}</td>
          <td>${inquiry.phone}</td>
          <td>${inquiry.country || "N/A"}</td>
          <td>
            <select class="status-select" data-id="${inquiry.id}">
              <option value="new" ${inquiry.status === "new" ? "selected" : ""}>New</option>
              <option value="in_progress" ${inquiry.status === "in_progress" ? "selected" : ""}>In Progress</option>
              <option value="resolved" ${inquiry.status === "resolved" ? "selected" : ""}>Resolved</option>
            </select>
          </td>
          <td>
            <select class="assignee-select" data-id="${inquiry.id}">
              <option value="">Unassigned</option>
              <option value="Dhruv Navdiya" ${inquiry.assigned_to === "Dhruv Navdiya" ? "selected" : ""}>Dhruv Navdiya</option>
              <option value="Dhruv Khokhar" ${inquiry.assigned_to === "Dhruv Khokhar" ? "selected" : ""}>Dhruv Khokhar</option>
              <option value="Om Navdiya" ${inquiry.assigned_to === "Om Navdiya" ? "selected" : ""}>Om Navdiya</option>
            </select>
          </td>
          <td>${formatDateDDMMYYYY(inquiry.created_at)}</td>
          <td>
            <button class="action-btn view-btn" data-id="${inquiry.id}">View</button>
            <button class="action-btn delete-inquiry" data-id="${inquiry.id}">Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      attachInquiryEventHandlers();
    })
    .catch((err) => {
      console.error("Error loading inquiries:", err);
      tbody.innerHTML = `<tr><td colspan='10' style='text-align:center;padding:20px;color:red;'>Error loading inquiries: ${err.message}</td></tr>`;
    });
}

function attachInquiryEventHandlers() {
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", () => viewInquiry(btn.dataset.id));
  });

  document.querySelectorAll(".status-select").forEach((select) => {
    select.addEventListener("change", () =>
      updateInquiryStatus(select.dataset.id, select.value)
    );
  });

  document.querySelectorAll(".assignee-select").forEach((select) => {
    select.addEventListener("change", () =>
      updateInquiryAssignee(select.dataset.id, select.value)
    );
  });

  document.querySelectorAll(".notes-btn").forEach((btn) => {
    btn.addEventListener("click", () => toggleNotesSection(btn.dataset.id));
  });

  document.querySelectorAll(".delete-inquiry").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("Are you sure you want to delete this inquiry?")) return;

      fetch("php/delete-inquiry.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "id=" + encodeURIComponent(btn.dataset.id),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            alert("Inquiry deleted successfully");
            refreshCurrentFilters();
          } else {
            alert("Error: " + (data.error || "Failed to delete"));
          }
        });
    });
  });
}

function refreshCurrentFilters() {
  const filter = document.getElementById("quickDateFilter").value;
  const status = document.getElementById("quickStatusFilter").value;
  let start = "", end = "";

  if (filter === "custom") {
    start = document.getElementById("quickStartDate").value;
    end = document.getElementById("quickEndDate").value;
  }

  loadInquiries(filter, start, end, status);
}

/* ---------------- INQUIRY ASSIGNEE ---------------- */
async function updateInquiryAssignee(id, assignee) {
  try {
    const res = await fetch("php/update-inquiry-assignee.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `id=${id}&assignee=${encodeURIComponent(assignee)}`,
    });
    const data = await res.json();
    if (!data.success) alert("Error updating assignee");
  } catch (err) {
    console.error("Error updating assignee:", err);
    alert("Error updating assignee");
  }
}
 
/* ---------------- VIEW INQUIRY ---------------- */
function viewInquiry(id) {
  fetch(`php/get-inquiry.php?id=${id}`)
    .then((r) => r.json())
    .then((inquiry) => {
      alert(
        `Inquiry Details:\n\nName: ${inquiry.name}\nCompany: ${
          inquiry.company
        }\nEmail: ${inquiry.email}\nPhone: ${inquiry.phone}\nCountry: ${
          inquiry.country
        }\nStatus: ${inquiry.status}\nAssignee: ${inquiry.assigned_to || 'None'}\nMessage: ${
          inquiry.message
        }\nDate: ${formatDateDDMMYYYY(inquiry.created_at)}`
      );
    })
    .catch(() => alert("Error loading inquiry details"));
}

function updateInquiryStatus(id, status) {
  fetch("php/update-inquiry.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `id=${id}&status=${status}`,
  })
    .then((r) => r.json())
    .then((data) => {
      if (!data.success) alert("Error updating status");
    })
    .catch(() => alert("Error updating status"));
}

/* ---------------- BLOG POSTS ---------------- */
function loadBlogPosts() {
  fetch("php/get-blog-posts.php")
    .then((r) => r.json())
    .then((posts) => {
      const tbody = document.querySelector("#blog-posts-table tbody");
      tbody.innerHTML = "";
      posts.forEach((post) => {
        const tr = document.createElement("tr");
        tr.classList.add('blog-post-row');
        tr.innerHTML = `
          <td>${post.id}</td>
          <td>${post.title}</td>
          <td>${post.slug || "N/A"}</td>
          <td>${post.excerpt || "N/A"}</td>
          <td>${formatDateDDMMYYYY(post.created_at)}</td>
          <td>
            <button class="action-btn edit-btn edit-blog-btn" data-id="${post.id}">Edit</button>
            <button class="action-btn delete-btn delete-blog-btn" data-id="${post.id}">Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
        
        // Create inline edit form
        const inlineForm = document.createElement("tr");
        inlineForm.classList.add('inline-edit-row');
        inlineForm.innerHTML = `
          <td colspan="6">
            <div class="inline-edit-form" id="blog-edit-form-${post.id}">
              <h3>Edit Blog Post: ${post.title}</h3>
              <form class="inline-blog-form" data-id="${post.id}">
                <input type="hidden" name="id" value="${post.id}">
                
                <div class="form-group">
                  <label for="blog-title-${post.id}">Title:</label>
                  <input type="text" id="blog-title-${post.id}" name="title" value="${post.title.replace(/"/g, '&quot;')}" required>
                </div>
                
                <div class="form-group">
                  <label for="blog-slug-${post.id}">Slug (URL-friendly):</label>
                  <input type="text" id="blog-slug-${post.id}" name="slug" value="${post.slug || ''}" required>
                  <small style="color: #666; font-size: 0.9em;">Used in the URL: https://oceanarcexim.com/blog-single.html?slug=your-slug-here</small>
                </div>
                
                <div class="form-group">
                  <label for="blog-excerpt-${post.id}">Excerpt:</label>
                  <textarea id="blog-excerpt-${post.id}" name="excerpt">${post.excerpt || ''}</textarea>
                </div>
                
                <div class="form-group">
                  <label for="blog-content-${post.id}">Content:</label>
                  <textarea id="blog-content-${post.id}" name="content" rows="6" required>${post.content || ''}</textarea>
                </div>
                
                <div class="form-group">
                  <label for="blog-image-${post.id}">Image:</label>
                  <input type="file" id="blog-image-${post.id}" name="image" accept="image/*" class="inline-image-input" data-existing-image="${post.image || ''}">
                  ${post.image ? `
                  <div class="image-preview-container" style="margin-top: 10px;">
                    <img src="${post.image}" alt="Current Image" style="max-width: 200px; display: block; margin-bottom: 10px;">
                    <button type="button" class="action-btn delete-btn delete-inline-image-btn" data-id="${post.id}">Delete Image</button>
                  </div>
                  ` : ''}
                </div>
                
                <div class="inline-form-buttons">
                  <button type="submit" class="action-btn save-btn">Save Changes</button>
                  <button type="button" class="action-btn cancel-btn cancel-inline-edit" data-id="${post.id}">Cancel</button>
                </div>
              </form>
            </div>
          </td>
        `;
        tbody.appendChild(inlineForm);
      });

      // Attach event handlers
      document.querySelectorAll(".edit-blog-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          toggleInlineBlogForm(btn.dataset.id);
        });
      });

      document.querySelectorAll(".delete-blog-btn").forEach((btn) => {
        btn.addEventListener("click", () => deleteBlogPost(btn.dataset.id));
      });

      // Handle inline form submissions
      document.querySelectorAll(".inline-blog-form").forEach((form) => {
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          await saveInlineBlogPost(form);
        });
      });

      // Handle cancel buttons
      document.querySelectorAll(".cancel-inline-edit").forEach((btn) => {
        btn.addEventListener("click", () => {
          const form = document.getElementById(`blog-edit-form-${btn.dataset.id}`);
          form.style.display = 'none';
          form.classList.remove('active');
        });
      });

      // Handle inline image deletion
      document.querySelectorAll(".delete-inline-image-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const postId = btn.dataset.id;
          const form = btn.closest('.inline-blog-form');
          const imageInput = form.querySelector('.inline-image-input');
          const existingImage = imageInput.dataset.existingImage;
          
          if (!confirm("Are you sure you want to delete this image?")) return;
          
          try {
            const res = await fetch("php/delete-file.php", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: `filePath=${encodeURIComponent(existingImage)}&postId=${encodeURIComponent(postId)}`,
            });
            const data = await res.json();
            if (data.success) {
              alert("Image deleted successfully.");
              imageInput.dataset.existingImage = "";
              const previewContainer = btn.closest('.image-preview-container');
              if (previewContainer) {
                previewContainer.remove();
              }
            } else {
              alert(data.error || "Failed to delete image.");
            }
          } catch (err) {
            console.error("Delete image error:", err);
            alert("Error deleting image.");
          }
        });
      });
    })
    .catch((err) => console.error("Error loading posts:", err));
}

function toggleInlineBlogForm(postId) {
  // Hide any other open inline forms
  document.querySelectorAll('.inline-edit-form').forEach(form => {
    form.style.display = 'none';
    form.classList.remove('active');
  });
  
  // Show the clicked form
  const form = document.getElementById(`blog-edit-form-${postId}`);
  if (form) {
    form.style.display = 'block';
    form.classList.add('active');
    
    // Scroll to the form if needed
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

async function saveInlineBlogPost(form) {
  const formData = new FormData(form);
  const postId = formData.get('id');
  
  // Handle image upload if a new file is selected
  const imageInput = form.querySelector('.inline-image-input');
  const imageFile = imageInput.files[0];
  
  if (imageFile) {
    const uploadData = new FormData();
    uploadData.append("image_file", imageFile);
    
    try {
      const uploadRes = await fetch("php/upload-image.php", {
        method: "POST",
        body: uploadData,
      });
      const uploadJson = await uploadRes.json();
      if (!uploadJson.success) {
        alert(uploadJson.error || "Image upload failed");
        return;
      }
      formData.set("image", uploadJson.imagePath);
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Error uploading image");
      return;
    }
  } else {
    // Use existing image if no new file
    formData.set("image", imageInput.dataset.existingImage || "");
  }
  
  // Send the data
  try {
    const saveRes = await fetch("php/save-blog-post.php", {
      method: "POST",
      body: formData,
    });
    
    const saveText = await saveRes.text();
    let saveJson;
    try {
      saveJson = JSON.parse(saveText);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      alert("Server returned invalid JSON");
      return;
    }
    
    if (saveJson.success) {
      alert("Post updated successfully");
      loadBlogPosts(); // Reload to refresh the list
    } else {
      alert(saveJson.error || "Error updating post");
    }
  } catch (err) {
    console.error("Save error:", err);
    alert("Unexpected error occurred");
  }
}

// Old editBlogPost function (kept for reference but not used with inline forms)
function editBlogPost(id) {
  // This is now handled by toggleInlineBlogForm
  toggleInlineBlogForm(id);
}

async function saveBlogPost() {
  const id = document.getElementById("postId").value;
  const title = document.getElementById("postTitle").value.trim();
  const slug = document.getElementById("postSlug").value.trim();
  const excerpt = document.getElementById("postExcerpt").value.trim();
  const content = document.getElementById("postContent").value.trim();
  const imageInput = document.getElementById("postImage");

  if (!title || !content) {
    alert("Title and content are required");
    return;
  }

  if (!slug) {
    alert("Slug is required for SEO-friendly URLs");
    return;
  }

  try {
    let finalImagePath = imageInput.dataset.existingImage || "";
    const file = imageInput.files[0];
    if (file) {
      const uploadData = new FormData();
      uploadData.append("image_file", file);
      const uploadRes = await fetch("php/upload-image.php", {
        method: "POST",
        body: uploadData,
      });
      const uploadJson = await uploadRes.json();
      if (!uploadJson.success) {
        alert(uploadJson.error || "Image upload failed");
        return;
      }
      finalImagePath = uploadJson.imagePath;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("excerpt", excerpt);
    formData.append("image", finalImagePath);
    formData.append("content", content);

    const saveRes = await fetch("php/save-blog-post.php", {
      method: "POST",
      body: formData,
    });
    const rawText = await saveRes.text();
    console.log("Raw save-blog-post.php response:", rawText);

    let saveJson;
    try {
      saveJson = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      alert("Server did not return valid JSON. Check console for details.");
      return;
    }

    if (saveJson.success) {
      alert("Post saved successfully");
      document.getElementById("postForm").style.display = "none";
      loadBlogPosts();
    } else {
      alert(saveJson.error || "Error saving post");
    }
  } catch (err) {
    console.error("Save error:", err);
    alert("Unexpected error occurred");
  }
}

function deleteBlogPost(id) {
  if (!confirm("Delete this post?")) return;
  fetch("php/delete-blog-post.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `id=${id}`,
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.success) {
        alert("Post deleted");
        loadBlogPosts();
      } else {
        alert("Error deleting post");
      }
    })
    .catch(() => alert("Error deleting post"));
}

/* ---------------- PRODUCTS ---------------- */
function loadProducts() {
  fetch("php/get-products.php")
    .then((r) => r.json())
    .then((products) => {
      const tbody = document.querySelector("#products-table tbody");
      tbody.innerHTML = "";
      products.forEach((product) => {
        const tr = document.createElement("tr");
        tr.classList.add('product-row');
        tr.innerHTML = `
          <td>${product.id}</td>
          <td>${product.title}</td>
          <td>${product.slug || "N/A"}</td> <!-- ADDED THIS CELL -->
          <td>${product.category || "N/A"}</td>
          <td>${formatDateDDMMYYYY(product.created_at)}</td>
          <td>
            <button class="action-btn edit-btn edit-product-btn" data-id="${product.id}">Edit</button>
            <button class="action-btn delete-btn delete-product-btn" data-id="${product.id}">Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
        
        // Create inline edit form WITH SLUG FIELD
        const inlineForm = document.createElement("tr");
        inlineForm.classList.add('inline-edit-row');
        inlineForm.innerHTML = `
          <td colspan="6"> <!-- Changed from colspan="5" to colspan="6" since we added a column -->
            <div class="inline-edit-form" id="product-edit-form-${product.id}">
              <h3>Edit Product: ${product.title}</h3>
              <form class="inline-product-form" data-id="${product.id}">
                <input type="hidden" name="id" value="${product.id}">
                
                <div class="form-group">
                  <label for="product-title-${product.id}">Title:</label>
                  <input type="text" id="product-title-${product.id}" name="title" value="${product.title.replace(/"/g, '&quot;')}" required>
                </div>
                
                <!-- Slug field -->
                <div class="form-group">
                  <label for="product-slug-${product.id}">Slug (URL-friendly):</label>
                  <input type="text" id="product-slug-${product.id}" name="slug" value="${product.slug || ''}" required>
                  <small style="color: #666; font-size: 0.9em;">Used in the URL: https://oceanarcexim.com/agro-single.html?slug=your-slug-here</small>
                </div>
                
                <div class="form-group">
                  <label for="product-category-${product.id}">Category:</label>
                  <input type="text" id="product-category-${product.id}" name="category" value="${product.category || ''}">
                </div>
                
                <div class="form-group">
                  <label for="product-description-${product.id}">Short Description:</label>
                  <textarea id="product-description-${product.id}" name="description">${product.description || ''}</textarea>
                </div>
                
                <div class="form-group">
                  <label for="product-specs-${product.id}">Specifications (one per line):</label>
                  <textarea id="product-specs-${product.id}" name="specifications">${product.specifications || ''}</textarea>
                </div>
                
                <div class="form-group">
                  <label for="product-content-${product.id}">Detailed Content:</label>
                  <textarea id="product-content-${product.id}" name="content" rows="6" required>${product.content || ''}</textarea>
                </div>
                
                <div class="form-group">
                  <label for="product-image-${product.id}">Image:</label>
                  <input type="file" id="product-image-${product.id}" name="image" accept="image/*" class="inline-product-image-input" data-existing-image="${product.image || ''}">
                  ${product.image ? `
                  <div class="image-preview-container" style="margin-top: 10px;">
                    <img src="${product.image}" alt="Current Image" style="max-width: 200px; display: block; margin-bottom: 10px;">
                    <button type="button" class="action-btn delete-btn delete-inline-product-image-btn" data-id="${product.id}">Delete Image</button>
                  </div>
                  ` : ''}
                </div>
                
                <div class="form-group">
                  <label for="product-video-${product.id}">Video:</label>
                  <input type="file" id="product-video-${product.id}" name="video" accept="video/*" class="inline-product-video-input" data-existing-video="${product.video || ''}">
                  ${product.video ? `
                  <div class="video-preview-container" style="margin-top: 10px;">
                    <video src="${product.video}" controls style="max-width: 300px; display: block; margin-bottom: 10px;"></video>
                    <button type="button" class="action-btn delete-btn delete-inline-product-video-btn" data-id="${product.id}">Delete Video</button>
                  </div>
                  ` : ''}
                </div>
                
                <div class="inline-form-buttons">
                  <button type="submit" class="action-btn save-btn">Save Changes</button>
                  <button type="button" class="action-btn cancel-btn cancel-inline-product-edit" data-id="${product.id}">Cancel</button>
                </div>
              </form>
            </div>
          </td>
        `;
        tbody.appendChild(inlineForm);
      });

      // Attach event handlers
      document.querySelectorAll(".edit-product-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          toggleInlineProductForm(btn.dataset.id);
        });
      });

      document.querySelectorAll(".delete-product-btn").forEach((btn) => {
        btn.addEventListener("click", () => deleteProduct(btn.dataset.id));
      });

      // Handle inline form submissions
      document.querySelectorAll(".inline-product-form").forEach((form) => {
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          await saveInlineProduct(form);
        });
        
        // Add auto-generate slug for inline forms
        const titleInput = form.querySelector('input[name="title"]');
        const slugInput = form.querySelector('input[name="slug"]');
        const productId = form.querySelector('input[name="id"]').value;
        
        titleInput.addEventListener('input', function() {
          const title = this.value.trim();
          // Only auto-generate if slug is empty or product is new
          if ((!productId || slugInput.value === '') && title) {
            slugInput.value = generateSlug(title);
          }
        });
      });

      // Handle cancel buttons
      document.querySelectorAll(".cancel-inline-product-edit").forEach((btn) => {
        btn.addEventListener("click", () => {
          const form = document.getElementById(`product-edit-form-${btn.dataset.id}`);
          form.style.display = 'none';
          form.classList.remove('active');
        });
      });

      // Handle inline image deletion
      document.querySelectorAll(".delete-inline-product-image-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const productId = btn.dataset.id;
          const form = btn.closest('.inline-product-form');
          const imageInput = form.querySelector('.inline-product-image-input');
          const existingImage = imageInput.dataset.existingImage;
          
          if (!confirm("Are you sure you want to delete this image?")) return;
          
          try {
            const res = await fetch("php/delete-file.php", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: `filePath=${encodeURIComponent(existingImage)}&productId=${encodeURIComponent(productId)}`,
            });
            const data = await res.json();
            if (data.success) {
              alert("Image deleted successfully.");
              imageInput.dataset.existingImage = "";
              const previewContainer = btn.closest('.image-preview-container');
              if (previewContainer) {
                previewContainer.remove();
              }
            } else {
              alert(data.error || "Failed to delete image.");
            }
          } catch (err) {
            console.error("Delete image error:", err);
            alert("Error deleting image.");
          }
        });
      });

      // Handle inline video deletion
      document.querySelectorAll(".delete-inline-product-video-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const productId = btn.dataset.id;
          const form = btn.closest('.inline-product-form');
          const videoInput = form.querySelector('.inline-product-video-input');
          const existingVideo = videoInput.dataset.existingVideo;
          
          if (!confirm("Are you sure you want to delete this video?")) return;
          
          try {
            const res = await fetch("php/delete-file.php", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: `filePath=${encodeURIComponent(existingVideo)}&productId=${encodeURIComponent(productId)}`,
            });
            const data = await res.json();
            if (data.success) {
              alert("Video deleted successfully.");
              videoInput.dataset.existingVideo = "";
              const previewContainer = btn.closest('.video-preview-container');
              if (previewContainer) {
                previewContainer.remove();
              }
            } else {
              alert(data.error || "Failed to delete video.");
            }
          } catch (err) {
            console.error("Delete video error:", err);
            alert("Error deleting video.");
          }
        });
      });
    })
    .catch((err) => console.error("Error loading products:", err));
}

function toggleInlineProductForm(productId) {
  // Hide any other open inline forms
  document.querySelectorAll('.inline-edit-form').forEach(form => {
    form.style.display = 'none';
    form.classList.remove('active');
  });
  
  // Show the clicked form
  const form = document.getElementById(`product-edit-form-${productId}`);
  if (form) {
    form.style.display = 'block';
    form.classList.add('active');
    
    // Scroll to the form if needed
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

async function saveInlineProduct(form) {
  const formData = new FormData(form);
  const productId = formData.get('id');
  
  // Handle image upload if a new file is selected
  const imageInput = form.querySelector('.inline-product-image-input');
  const imageFile = imageInput.files[0];
  
  if (imageFile) {
    const uploadData = new FormData();
    uploadData.append("image_file", imageFile);
    
    try {
      const uploadRes = await fetch("php/upload-image.php", {
        method: "POST",
        body: uploadData,
      });
      const uploadJson = await uploadRes.json();
      if (!uploadJson.success) {
        alert(uploadJson.error || "Image upload failed");
        return;
      }
      formData.set("image", uploadJson.imagePath);
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Error uploading image");
      return;
    }
  } else {
    // Use existing image if no new file
    formData.set("image", imageInput.dataset.existingImage || "");
  }
  
  // Handle video upload if a new file is selected
  const videoInput = form.querySelector('.inline-product-video-input');
  const videoFile = videoInput.files[0];
  
  if (videoFile) {
    // Check file size client-side (50MB limit)
    const maxSize = 50 * 1024 * 1024;
    if (videoFile.size > maxSize) {
      alert(`Video file is too large (${(videoFile.size / (1024 * 1024)).toFixed(2)}MB). Maximum 50MB allowed.`);
      return;
    }
    
    const uploadData = new FormData();
    uploadData.append("video_file", videoFile);
    
    try {
      const uploadRes = await fetch("php/upload-video.php", {
        method: "POST",
        body: uploadData,
      });
      
      if (uploadRes.status === 413) {
        throw new Error("File too large for server configuration. Please try a smaller video file.");
      }
      
      if (!uploadRes.ok) {
        throw new Error(`Server error: ${uploadRes.status}`);
      }
      
      const uploadJson = await uploadRes.json();
      if (!uploadJson.success) {
        throw new Error(uploadJson.error || "Video upload failed");
      }
      formData.set("video", uploadJson.videoPath);
    } catch (uploadError) {
      console.error("Video upload error:", uploadError);
      alert("Video upload failed: " + uploadError.message);
      return;
    }
  } else {
    // Use existing video if no new file
    formData.set("video", videoInput.dataset.existingVideo || "");
  }
  
  // Send the data
  try {
    const saveRes = await fetch("php/save-product.php", {
      method: "POST",
      body: formData,
    });
    
    const saveText = await saveRes.text();
    let saveJson;
    try {
      saveJson = JSON.parse(saveText);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      alert("Server returned invalid JSON");
      return;
    }
    
    if (saveJson.success) {
      alert("Product updated successfully");
      loadProducts(); // Reload to refresh the list
    } else {
      alert(saveJson.error || "Error updating product");
    }
  } catch (err) {
    console.error("Save error:", err);
    alert("Unexpected error occurred");
  }
}

// Old editProduct function (kept for reference but not used with inline forms)
function editProduct(id) {
  // This is now handled by toggleInlineProductForm
  toggleInlineProductForm(id);
}

async function saveProduct() {
  const id = document.getElementById("productId").value;
  const title = document.getElementById("productTitle").value.trim();
  const slug = document.getElementById("productSlug").value.trim(); // ADDED
  const category = document.getElementById("productCategory").value.trim();
  const description = document.getElementById("productDescription").value.trim();
  const specs = document.getElementById("productSpecs").value.trim();
  const content = document.getElementById("productContent").value.trim();
  const imageInput = document.getElementById("productImage");
  const videoInput = document.getElementById("productVideo");

  if (!title || !content) {
    alert("Title and content are required");
    return;
  }

  if (!slug) {
    alert("Slug is required for SEO-friendly URLs");
    return;
  }

  try {
    let finalImagePath = imageInput.dataset.existingImage || "";
    let finalVideoPath = videoInput.dataset.existingVideo || "";

    // Handle image upload
    const imageFile = imageInput.files[0];
    if (imageFile) {
      console.log("Uploading image file:", imageFile.name);
      const uploadData = new FormData();
      uploadData.append("image_file", imageFile);
      const uploadRes = await fetch("php/upload-image.php", {
        method: "POST",
        body: uploadData,
      });
      const uploadJson = await uploadRes.json();
      console.log("Image upload response:", uploadJson);

      if (!uploadJson.success) {
        alert(uploadJson.error || "Image upload failed");
        return;
      }
      finalImagePath = uploadJson.imagePath;
    }

    // Handle video upload with better error handling
    const videoFile = videoInput.files[0];
    if (videoFile) {
      console.log("Uploading video file:", videoFile.name, "Size:", (videoFile.size / (1024 * 1024)).toFixed(2) + "MB");
      
      const uploadData = new FormData();
      uploadData.append("video_file", videoFile);
      
      try {
        const uploadRes = await fetch("php/upload-video.php", {
          method: "POST",
          body: uploadData,
        });
        
        if (uploadRes.status === 413) {
          throw new Error("File too large for server configuration. Please try a smaller video file or contact your hosting provider to increase upload limits.");
        }
        
        if (!uploadRes.ok) {
          throw new Error(`Server error: ${uploadRes.status} - ${uploadRes.statusText}`);
        }
        
        const uploadJson = await uploadRes.json();
        console.log("Video upload response:", uploadJson);

        if (!uploadJson.success) {
          throw new Error(uploadJson.error || "Video upload failed");
        }
        finalVideoPath = uploadJson.videoPath;
        console.log("Video uploaded successfully:", finalVideoPath);
      } catch (uploadError) {
        console.error("Video upload error:", uploadError);
        alert("Video upload failed: " + uploadError.message);
        return;
      }
    }

    console.log("Final paths - Image:", finalImagePath, "Video:", finalVideoPath);

    const formData = new FormData();
    formData.append("id", id);
    formData.append("title", title);
    formData.append("slug", slug); // ADDED
    formData.append("category", category);
    formData.append("description", description);
    formData.append("specifications", specs);
    formData.append("content", content);
    formData.append("image", finalImagePath);
    formData.append("video", finalVideoPath);

    console.log("Saving product data...");
    const saveRes = await fetch("php/save-product.php", {
      method: "POST",
      body: formData,
    });
    
    const saveText = await saveRes.text();
    console.log("Save response:", saveText);
    
    let saveJson;
    try {
      saveJson = JSON.parse(saveText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      alert("Server returned invalid JSON. Check console for details.");
      return;
    }

    if (saveJson.success) {
      alert("Product saved successfully");
      document.getElementById("productForm").style.display = "none";
      loadProducts();
    } else {
      alert("Error saving product: " + (saveJson.error || "Unknown error"));
    }
  } catch (err) {
    console.error("Save error:", err);
    alert("Unexpected error occurred: " + err.message);
  }
}

function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  fetch("php/delete-product.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `id=${id}`,
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.success) {
        alert("Product deleted");
        loadProducts();
      } else {
        alert("Error deleting product");
      }
    })
    .catch(() => alert("Error deleting product"));
}

/* ---------------- UPLOADS ---------------- */
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function loadUploads() {
  fetch("php/get-uploads.php")
    .then((r) => r.json())
    .then((files) => {
      const tbody = document.querySelector("#uploads-table tbody");
      tbody.innerHTML = "";
      files.forEach((file) => {
        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);
        const isVideo = /\.(mp4|mpeg|mov|avi|wmv|webm)$/i.test(file.name);
        let preview = `<span>${file.name}</span>`;
        
        if (isImage) {
          preview = `<img src="uploads/${file.name}" alt="${file.name}" style="max-width:80px;max-height:80px;border-radius:5px;">`;
        } else if (isVideo) {
          preview = `<video src="uploads/${file.name}" style="max-width:80px;max-height:80px;border-radius:5px;" controls></video>`;
        }
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
                    <td>${preview}</td>
                    <td>${file.name}</td>
                    <td>${formatFileSize(file.size)}</td>
                    <td>${file.date}</td>
                    <td>
                        <a href="uploads/${file.name}" target="_blank" class="action-btn edit-btn">Download</a>
                        <button class="action-btn delete-btn" data-filename="${file.name}">Delete</button>
                    </td>
                `;
        tbody.appendChild(tr);
      });

      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (!confirm("Delete this file?")) return;
          fetch("php/delete-upload.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `filename=${encodeURIComponent(btn.dataset.filename)}`,
          })
            .then((r) => r.json())
            .then((res) => {
              if (res.success) {
                alert("File deleted");
                loadUploads();
              } else {
                alert(res.error);
              }
            });
        });
      });
    });
}
