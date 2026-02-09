<div align="center">
  <img src="images/logo.svg" alt="OceanArc Exim Logo" width="200" height="auto" />
  <h1>OceanArc Exim</h1>
  <p><strong>Agro & Textile Export Company India</strong></p>
  <p>Connect the world, seamlessly</p>

  <p>
    <a href="https://oceanarcexim.com">Website</a> •
    <a href="#about">About</a> •
    <a href="#features">Features</a> •
    <a href="#products">Products</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#contact">Contact</a>
  </p>
</div>

<hr />

<h2 id="about">About</h2>
<p>
  OceanArc Exim is a leading Indian import-export company specializing in premium agro products and sustainable textile exports from Surat, Gujarat. We are committed to delivering quality products globally with efficient logistics and storage solutions. Our mission is to connect the world with the best of nature, building long-term relationships based on trust, transparency, and excellence.
</p>

<h2 id="features">Key Features</h2>
<ul>
  <li><strong>Global Logistics:</strong> Efficient shipping and transportation solutions across continents.</li>
  <li><strong>Storage Solutions:</strong> Secure and climate-controlled facilities for product preservation.</li>
  <li><strong>Documentation Handling:</strong> Comprehensive support for export-import documentation and compliance.</li>
  <li><strong>Admin Dashboard:</strong> A robust admin panel to manage products, blog posts, inquiries, and more.</li>
  <li><strong>Dynamic Content:</strong> Real-time product listings and blog updates via the admin interface.</li>
  <li><strong>Responsive Design:</strong> Fully optimized for mobile, tablet, and desktop devices.</li>
</ul>

<h2 id="products">Our Product Lines</h2>

<h3>Agro Products</h3>
<ul>
  <li><strong>Rice:</strong> Premium Basmati and Non-Basmati varieties.</li>
  <li><strong>Pulses:</strong> High-quality lentils and beans.</li>
  <li><strong>Wheat & Millets:</strong> Sourced directly from trusted farms.</li>
</ul>

<h3>Textile Exports</h3>
<ul>
  <li><strong>Fabrics:</strong> High-quality textiles from India's finest hubs.</li>
  <li><strong>Garments:</strong>
    <ul>
      <li>Traditional Banarasi Silk Sarees</li>
      <li>Printed Cotton Kurtis</li>
      <li>Embroidered Lehengas</li>
      <li>Men's Ethnic Wear (Kurtas, etc.)</li>
    </ul>
  </li>
</ul>

<h2 id="tech-stack">Tech Stack</h2>
<ul>
  <li><strong>Frontend:</strong> HTML5, CSS3, JavaScript (Vanilla)</li>
  <li><strong>Backend:</strong> PHP</li>
  <li><strong>Database:</strong> MySQL</li>
  <li><strong>Styling:</strong> Custom CSS, FontAwesome for icons</li>
  <li><strong>Video Integration:</strong> Optimized HTML5 video players for product showcases</li>
</ul>

<h2 id="installation">Installation & Setup</h2>

<p>To set up this project locally:</p>

<ol>
  <li><strong>Clone the repository</strong>
    <pre><code>git clone https://github.com/yourusername/OceanArc_Exim.git
cd OceanArc_Exim</code></pre>
  </li>

  <li><strong>Database Setup</strong>
    <ul>
      <li>Create a new MySQL database (e.g., <code>oceanarc_db</code>).</li>
      <li>Import the provided SQL dump file: <code>backup.sql</code> (located in the root or <code>sql/</code> directory if applicable).</li>
    </ul>
  </li>

  <li><strong>Configuration</strong>
    <ul>
      <li>Navigate to the <code>php/config/</code> directory.</li>
      <li>Open the database configuration file (e.g., <code>config.php</code> or <code>db_connect.php</code>).</li>
      <li>Update the database credentials:
        <pre><code class="language-php">$servername = "localhost";
$username = "your_username";
$password = "your_password";
$dbname = "oceanarc_db";</code></pre>
      </li>
    </ul>
  </li>

  <li><strong>Run the Application</strong>
    <ul>
      <li>Host the project on a local server like Apache (XAMPP, WAMP, MAMP).</li>
      <li>Access the website via your browser: <code>http://localhost/OceanArc_Exim</code></li>
    </ul>
  </li>
</ol>

<h2 id="admin-panel">Admin Panel</h2>
<p>
  The project includes an admin dashboard for managing content.
  <br />
  <strong>Login URL:</strong> <code>/admin-login.html</code>
  <br />
  <em>(Note: Ensure you have the correct admin credentials from the database)</em>
</p>

<h2 id="folder-structure">Folder Structure</h2>
<pre>
/
├── css/             # Stylesheets (style.css, responsive.css)
├── images/          # Product images, logos, and icons
├── js/              # JavaScript files for interactivity
├── php/             # Backend logic (API endpoints, DB handlers)
│   ├── config/      # Database configuration
│   └── ...          # Action scripts (save-product.php, etc.)
├── uploads/         # Directory for user/admin uploaded files
├── videos/          # Promotional and product videos
├── admin-*.html     # Admin interface pages
├── index.html       # Main landing page
└── README.md        # Project documentation
</pre>

<h2 id="contact">Contact</h2>
<p>
  <strong>OceanArc Exim</strong>
  <br />
  📍 Surat, Gujarat, India
  <br />
  📞 +91 7096200535
  <br />
  🌐 <a href="https://oceanarcexim.com">https://oceanarcexim.com</a>
</p>

<hr />

<p align="center">
  Developed with ❤️ by the OceanArc Exim Team
</p>
