<h1>Life Moments Visualizer</h1>

<p>
  A beautiful web application that transforms your life moments into stunning AI-generated visual memories.
  Capture memories, envision future goals, or explore alternate life scenarios with cinematic-quality images powered by
  <strong>OpenAI's DALL·E 3</strong>.
</p>

<hr />

<h2>Features</h2>

<ul>
  <li><strong>AI-Powered Visualization</strong> - Convert text descriptions into stunning images using DALL·E 3</li>
  <li>
    <strong>Multiple Moment Types</strong> - Capture different aspects of your life:
    <ul>
      <li><strong>Memory</strong> - Cherished moments from your past</li>
      <li><strong>Future Goal</strong> - Aspirations and dreams</li>
      <li><strong>Alternate Life</strong> - What-if scenarios and alternate realities</li>
      <li><strong>Dreamy</strong> - Surreal and imaginative moments</li>
    </ul>
  </li>
  <li>
    <strong>Cinematic Styles</strong> - Choose from various artistic styles:
    <ul>
      <li><strong>Dramatic</strong> - Bold and intense compositions</li>
      <li><strong>Dreamy</strong> - Soft, ethereal atmospheres</li>
      <li><strong>Nostalgic</strong> - Warm, vintage aesthetics</li>
      <li><strong>Epic</strong> - Grand, sweeping visuals</li>
      <li><strong>Intimate</strong> - Close, personal perspectives</li>
    </ul>
  </li>
  <li><strong>Collections</strong> - Organize moments into custom collections</li>
  <li><strong>Timeline View</strong> - Browse your moments chronologically</li>
  <li><strong>Responsive Design</strong> - Beautiful experience across all devices</li>
  <li><strong>Download &amp; Share</strong> - Save your generated images locally</li>
</ul>

<hr />

<h2>Tech Stack</h2>

<ul>
  <li><strong>Frontend</strong>: Next.js 13 (React 18)</li>
  <li><strong>Styling</strong>: Tailwind CSS</li>
  <li><strong>UI Components</strong>: shadcn/ui + Radix UI</li>
  <li><strong>Database</strong>: Supabase (PostgreSQL)</li>
  <li><strong>AI Generation</strong>: OpenAI DALL·E 3 API</li>
</ul>

<hr />

<h2>Prerequisites</h2>

<p>Before you begin, ensure you have:</p>

<ul>
  <li>Node.js 18+ installed</li>
  <li>npm or yarn package manager</li>
  <li>An OpenAI API key with DALL·E 3 access</li>
  <li>A Supabase account and project</li>
</ul>

<hr />

<h2>Getting Started</h2>

<h3>1. Clone the Repository</h3>

<pre><code>git clone https://github.com/yourusername/life-moments-visualizer.git
cd life-moments-visualizer</code></pre>

<h3>2. Install Dependencies</h3>

<pre><code>npm install</code></pre>

<h3>3. Set Up Environment Variables</h3>

<p>Create a <code>.env</code> file in the root directory:</p>

<pre><code># Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_URL=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key</code></pre>

<p><strong>Getting your credentials:</strong></p>

<ul>
  <li>
    <strong>Supabase</strong>:
    Create a project at
    <a href="https://supabase.com" target="_blank" rel="noreferrer">supabase.com</a>,
    then find your URL and anon key in <em>Project Settings &gt; API</em>
  </li>
  <li>
    <strong>OpenAI</strong>:
    Get your API key from
    <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">platform.openai.com/api-keys</a>
  </li>
</ul>

<h3>4. Set Up the Database</h3>

<p>
  The project includes migration files in <code>supabase/migrations/</code>. Apply them to your Supabase project:
</p>

<p><strong>Option A: Using Supabase CLI</strong></p>

<pre><code>npx supabase db push</code></pre>

<p><strong>Option B: Manual Setup</strong></p>

<p>Run the SQL files in order in your Supabase SQL Editor:</p>

<ol>
  <li><code>20260227022855_create_moments_table.sql</code></li>
  <li><code>20260227025313_add_collections_and_tags.sql</code></li>
  <li><code>20260228210639_add_delete_policy_to_moments.sql</code></li>
</ol>

<h3>5. Run the Development Server</h3>

<pre><code>npm run dev</code></pre>

<p>
  Open
  <a href="http://localhost:3000" target="_blank" rel="noreferrer">http://localhost:3000</a>
  in your browser.
</p>

<hr />

<h2>Database Schema</h2>

<h3>Tables</h3>

<p><strong>moments</strong></p>
<ul>
  <li><code>id</code> (uuid) - Primary key</li>
  <li><code>user_description</code> (text) - User's description of the moment</li>
  <li><code>moment_type</code> (text) - Type: Memory, Future Goal, Alternate Life, Dreamy</li>
  <li><code>cinematic_style</code> (text) - Style: Dramatic, Dreamy, Nostalgic, Epic, Intimate</li>
  <li><code>image_url</code> (text) - Generated image URL</li>
  <li><code>created_at</code> (timestamptz) - Creation timestamp</li>
</ul>

<p><strong>collections</strong></p>
<ul>
  <li><code>id</code> (uuid) - Primary key</li>
  <li><code>name</code> (text) - Collection name</li>
  <li><code>created_at</code> (timestamptz) - Creation timestamp</li>
</ul>

<p><strong>moment_collections</strong></p>
<ul>
  <li><code>moment_id</code> (uuid) - Foreign key to moments</li>
  <li><code>collection_id</code> (uuid) - Foreign key to collections</li>
  <li><code>added_at</code> (timestamptz) - When moment was added to collection</li>
</ul>

<hr />

<h2>Project Structure</h2>

<pre><code>life-moments-visualizer/
├── app/
│   ├── api/
│   │   └── generate-moment/     # API endpoint for DALL·E 3 generation
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── AddToCollection.tsx      # Collection management
│   ├── CollectionManager.tsx    # Collection browser
│   ├── EmptyState.tsx           # Empty state UI
│   ├── HeroSection.tsx          # Landing hero
│   ├── MomentBadges.tsx         # Type/style badges
│   ├── MomentCard.tsx           # Moment display card
│   ├── MomentForm.tsx           # Creation form
│   ├── MomentModal.tsx          # Detail view modal
│   ├── StatsBar.tsx             # Statistics display
│   └── TimelineView.tsx         # Timeline layout
├── lib/
│   ├── formatDate.ts            # Date formatting utilities
│   ├── supabase.ts              # Supabase client
│   ├── types.ts                 # TypeScript types
│   └── utils.ts                 # Utility functions
├── supabase/
│   └── migrations/              # Database migrations
└── public/                      # Static assets</code></pre>

<hr />

<h2>Building for Production</h2>

<pre><code>npm run build</code></pre>

<p>The build output will be in the <code>.next</code> directory.</p>

<hr />

<h2>Usage</h2>

<ol>
  <li>
    <strong>Create a Moment</strong>
    <ul>
      <li>Enter a description of your moment</li>
      <li>Select the moment type (Memory, Future Goal, etc.)</li>
      <li>Choose a cinematic style</li>
      <li>Click <strong>"Generate Moment"</strong> and wait for the AI to create your image</li>
    </ul>
  </li>
  <li>
    <strong>Organize with Collections</strong>
    <ul>
      <li>Click <strong>"Add to Collection"</strong> on any moment</li>
      <li>Create new collections or add to existing ones</li>
      <li>Filter your timeline by collection</li>
    </ul>
  </li>
  <li>
    <strong>Browse Your Timeline</strong>
    <ul>
      <li>Scroll through all your moments chronologically</li>
      <li>Click any moment to view details</li>
      <li>Download images or delete moments</li>
    </ul>
  </li>
</ol>

<hr />

<h2>API Routes</h2>

<h3>POST <code>/api/generate-moment</code></h3>

<p>Generates a moment using DALL·E 3.</p>

<p><strong>Request Body:</strong></p>

<pre><code>{
  "description": "Walking through autumn leaves",
  "momentType": "Memory",
  "cinematicStyle": "Nostalgic"
}</code></pre>

<p><strong>Response:</strong></p>

<pre><code>{
  "imageUrl": "https://...",
  "description": "Walking through autumn leaves",
  "momentType": "Memory",
  "cinematicStyle": "Nostalgic"
}</code></pre>

<hr />

<h2>Contributing</h2>

<p>Contributions are welcome! Please feel free to submit a Pull Request.</p>

<ol>
  <li>Fork the repository</li>
  <li>Create your feature branch (<code>git checkout -b feature/AmazingFeature</code>)</li>
  <li>Commit your changes (<code>git commit -m 'Add some AmazingFeature'</code>)</li>
  <li>Push to the branch (<code>git push origin feature/AmazingFeature</code>)</li>
  <li>Open a Pull Request</li>
</ol>

<hr />

<h2>License</h2>

<p>This project is licensed under the MIT License - see the <code>LICENSE</code> file for details.</p>

<hr />

<h2>Acknowledgments</h2>

<ul>
  <li>Built with <a href="https://nextjs.org/" target="_blank" rel="noreferrer">Next.js</a></li>
  <li>UI components from <a href="https://ui.shadcn.com/" target="_blank" rel="noreferrer">shadcn/ui</a></li>
  <li>AI generation powered by <a href="https://openai.com/dall-e-3" target="_blank" rel="noreferrer">OpenAI DALL·E 3</a></li>
  <li>Database by <a href="https://supabase.com/" target="_blank" rel="noreferrer">Supabase</a></li>
  <li>Icons by <a href="https://lucide.dev/" target="_blank" rel="noreferrer">Lucide</a></li>
</ul>

