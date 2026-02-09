const ExcelJS = require('exceljs');

async function generateChecklist() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Grove';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('App Store Checklist', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  });

  // Define columns - full content from CSV
  worksheet.columns = [
    { header: '#', key: 'sequence', width: 5 },
    { header: 'Priority', key: 'priority', width: 8 },
    { header: 'Phase', key: 'phase', width: 12 },
    { header: 'Store', key: 'store', width: 10 },
    { header: 'Category', key: 'category', width: 12 },
    { header: 'Activity', key: 'activity', width: 32 },
    { header: 'Description', key: 'description', width: 45 },
    { header: 'Deliverable', key: 'deliverable', width: 25 },
    { header: 'How To Do It', key: 'howTo', width: 55 },
    { header: 'Dependencies', key: 'dependencies', width: 25 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Documentation', key: 'documentation', width: 45 },
    { header: 'Owner', key: 'owner', width: 12 },
    { header: 'Target Date', key: 'targetDate', width: 12 },
    { header: 'Cost INR', key: 'costINR', width: 12 },
    { header: 'Cost USD', key: 'costUSD', width: 10 },
    { header: 'Timeline', key: 'timeline', width: 12 },
    { header: 'Notes', key: 'notes', width: 40 },
  ];

  // Complete data with all original CSV content + updated status
  const data = [
    {
      sequence: 1, priority: 'P0', phase: 'Pre-Launch', store: 'Both', category: 'Legal',
      activity: 'Create Privacy Policy',
      description: 'Required by both stores. Must detail data collection, storage, usage, third-party sharing, user rights (GDPR/CCPA).',
      deliverable: 'Privacy Policy document',
      howTo: '1. Use privacy policy generator (iubenda.com or privacypolicies.com)\n2. Customize for your data practices\n3. Host on your website/GitHub Pages\n4. Add URL to app stores and in-app settings',
      dependencies: 'Website or hosting for policy page',
      status: 'Done',
      documentation: 'grove-documentation/docs/legal/privacy-policy.md',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1-2 days',
      notes: 'Complete privacy policy with data collection tables. Ready to host.'
    },
    {
      sequence: 2, priority: 'P0', phase: 'Pre-Launch', store: 'Both', category: 'Legal',
      activity: 'Create Terms of Service',
      description: 'User agreement for app usage. Required for both stores.',
      deliverable: 'Terms of Service document',
      howTo: '1. Use ToS generator (termly.io or similar)\n2. Include user conduct rules, liability limitations\n3. Cover community guidelines\n4. Host publicly',
      dependencies: 'Privacy Policy completed',
      status: 'Done',
      documentation: 'grove-documentation/docs/legal/terms-of-service.md',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1-2 days',
      notes: 'Complete ToS with all sections. Ready to host.'
    },
    {
      sequence: 3, priority: 'P0', phase: 'Pre-Launch', store: 'iOS', category: 'Legal',
      activity: 'Create EULA (iOS)',
      description: 'End User License Agreement required for iOS apps.',
      deliverable: 'EULA document',
      howTo: '1. Apple provides standard EULA\n2. Can customize if needed\n3. Add to App Store Connect metadata',
      dependencies: 'None',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1 day',
      notes: 'Can use Apple\'s standard EULA'
    },
    {
      sequence: 4, priority: 'P0', phase: 'Pre-Launch', store: 'Android', category: 'Accounts',
      activity: 'Create Google Play Developer Account',
      description: 'Required to publish on Play Store. One-time registration fee.',
      deliverable: 'Play Console account',
      howTo: '1. Go to play.google.com/console\n2. Sign in with Google account\n3. Pay $25 one-time fee\n4. Complete account details\n5. Verify identity (can take 48hrs)',
      dependencies: 'Google account with payment method',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '2075', costUSD: '25', timeline: '2-3 days',
      notes: '$25 one-time fee. Use business account if possible'
    },
    {
      sequence: 5, priority: 'P0', phase: 'Pre-Launch', store: 'iOS', category: 'Accounts',
      activity: 'Create Apple Developer Account',
      description: 'Required to publish on App Store. Annual subscription.',
      deliverable: 'Apple Developer account',
      howTo: '1. Go to developer.apple.com/enroll\n2. Sign in with Apple ID\n3. Pay $99/year\n4. Complete enrollment (can take 48hrs)',
      dependencies: 'Apple ID + Payment method',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '8225', costUSD: '99', timeline: '2-5 days',
      notes: '$99/year recurring. Required for iOS distribution'
    },
    {
      sequence: 6, priority: 'P0', phase: 'Pre-Launch', store: 'Both', category: 'Marketing',
      activity: 'Set Up Waitlist Landing Page',
      description: 'Gauge interest before launch. Collect early adopters emails.',
      deliverable: 'Landing page live',
      howTo: '1. Create landing page on Framer (free tier)\n2. Add compelling headline and app preview\n3. Integrate Formspree/Formsspark for email collection\n4. Add social proof and features preview\n5. Set up thank you page with social sharing',
      dependencies: 'Domain (optional)',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0-1500', costUSD: '0-18', timeline: '1-2 days',
      notes: 'Framer free tier works. Formsspark free: 250 submissions/month'
    },
    {
      sequence: 7, priority: 'P1', phase: 'Pre-Launch', store: 'Both', category: 'Marketing',
      activity: 'Set Up Pre-Launch Email Sequence',
      description: 'Nurture waitlist subscribers until launch.',
      deliverable: 'Email sequence configured',
      howTo: '1. Use Loops.so or Mailchimp for email automation\n2. Create welcome email for signup\n3. Create 2-3 teaser emails with feature previews\n4. Create launch day announcement email\n5. Schedule sequence',
      dependencies: 'Waitlist page + Email tool',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0-2500', costUSD: '0-30', timeline: '1-2 days',
      notes: 'Loops.so free: 1000 contacts. Mailchimp free: 500 contacts'
    },
    {
      sequence: 8, priority: 'P0', phase: 'Pre-Launch', store: 'Both', category: 'Branding',
      activity: 'Finalize App Name',
      description: 'Grove - ensure name is available on both stores.',
      deliverable: 'Confirmed app name',
      howTo: '1. Search Play Store for \'Grove\'\n2. Search App Store for \'Grove\'\n3. If taken, consider \'Grove Community\' or similar\n4. Update app.json with final name',
      dependencies: 'None',
      status: 'In Progress',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1 day',
      notes: 'Current name: Grove'
    },
    {
      sequence: 9, priority: 'P0', phase: 'Pre-Launch', store: 'Both', category: 'Branding',
      activity: 'Create App Icon',
      description: '1024x1024 icon for stores. Multiple sizes for devices.',
      deliverable: 'App icon assets',
      howTo: '1. Design 1024x1024 master icon\n2. Use icon generators for all sizes\n3. Android: Adaptive icon (foreground + background)\n4. iOS: Solid corners (system rounds them)\n5. Update assets in expo project',
      dependencies: 'Branding guidelines',
      status: 'In Progress',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0-15000', costUSD: '0-180', timeline: '2-3 days',
      notes: 'Icons exist in docs/assets. Verify final quality'
    },
    {
      sequence: 10, priority: 'P0', phase: 'Pre-Launch', store: 'Android', category: 'Branding',
      activity: 'Create Feature Graphic (Android)',
      description: '1024x500 banner for Play Store listing.',
      deliverable: 'Feature graphic image',
      howTo: '1. Design landscape banner\n2. Include app name and tagline\n3. Showcase key feature or screenshots\n4. Follow Google\'s design guidelines',
      dependencies: 'App Icon + Branding',
      status: 'Not Started',
      documentation: 'grove-documentation/docs/operations/store-listing-android.md',
      owner: '', targetDate: '',
      costINR: '0-8000', costUSD: '0-100', timeline: '1-2 days',
      notes: 'Required for Play Store. Can use Canva free. Guidelines in docs.'
    },
    {
      sequence: 11, priority: 'P0', phase: 'Pre-Launch', store: 'Both', category: 'Assets',
      activity: 'Create Professional App Screenshots',
      description: 'Store listing screenshots - CRITICAL for conversion.',
      deliverable: 'Screenshot set for all devices',
      howTo: '1. Use TheScreenshotFirstCompany or similar service\n2. Capture 8 key screens per device size\n3. Add compelling captions and context frames\n4. A/B test different styles\n5. Include lifestyle/mockup versions',
      dependencies: 'Working app + Device mockups',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '8000-40000', costUSD: '100-500', timeline: '3-5 days',
      notes: 'Professional screenshots increase downloads 25-35%. Worth the investment.'
    },
    {
      sequence: 12, priority: 'P1', phase: 'Pre-Launch', store: 'Both', category: 'Assets',
      activity: 'Create App Preview Video',
      description: '15-30 second video showing app in action.',
      deliverable: 'Preview video',
      howTo: '1. Screen record key user flows\n2. Add captions and music\n3. iOS: 1920x1080 or device resolution\n4. Android: YouTube video link\n5. Edit with iMovie/Premiere/Canva',
      dependencies: 'Working app',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0-10000', costUSD: '0-120', timeline: '2-3 days',
      notes: 'Optional but highly recommended. Free tools available'
    },
    {
      sequence: 13, priority: 'P0', phase: 'Pre-Launch', store: 'iOS', category: 'Content',
      activity: 'Write App Store Description with ASO',
      description: 'Short and full description optimized for search.',
      deliverable: 'App Store descriptions',
      howTo: '1. Use AppTweak, SensorTower, or ASO.dev for keyword research\n2. Write compelling 80-char short description\n3. Write 4000-char full description with keywords\n4. Highlight key features with bullet points\n5. Include call-to-action',
      dependencies: 'Finalized feature list + ASO tool',
      status: 'Done',
      documentation: 'grove-documentation/docs/operations/store-listing-ios.md',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1-2 days',
      notes: 'Copy-paste ready. Subtitle, promotional text, full description included.'
    },
    {
      sequence: 14, priority: 'P1', phase: 'Pre-Launch', store: 'iOS', category: 'Content',
      activity: 'Optimize Keywords (iOS)',
      description: '100-character keyword field for App Store search.',
      deliverable: 'Keyword list',
      howTo: '1. Research competitor keywords\n2. Use ASO tool for keyword suggestions\n3. Prioritize high-traffic low-competition keywords\n4. Include location terms if relevant\n5. Update keywords after launch based on data',
      dependencies: 'ASO tool subscription',
      status: 'Done',
      documentation: 'grove-documentation/docs/operations/store-listing-ios.md',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1 day',
      notes: '97 chars optimized: community,events,groups,organizer,RWA,club,association,polls,tasks,meetings,members,social,planning'
    },
    {
      sequence: 15, priority: 'P1', phase: 'Pre-Launch', store: 'Both', category: 'Content',
      activity: 'Write Release Notes',
      description: 'What\'s new in this version for each release.',
      deliverable: 'Release notes',
      howTo: '1. List new features\n2. Mention bug fixes\n3. Keep it concise and user-friendly\n4. Update with each release',
      dependencies: 'Version planning',
      status: 'Done',
      documentation: 'grove-documentation/docs/operations/release-notes.md',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1 day',
      notes: 'v1.0.0 notes complete + template for future releases'
    },
    {
      sequence: 16, priority: 'P0', phase: 'Pre-Launch', store: 'Both', category: 'Technical',
      activity: 'Configure App Bundle ID / Package Name',
      description: 'Unique identifier for your app. Cannot change after publish.',
      deliverable: 'Bundle ID configured',
      howTo: '1. Choose format: com.grove.app or similar\n2. Update app.json ios.bundleIdentifier\n3. Update app.json android.package\n4. Ensure consistency',
      dependencies: 'None',
      status: 'In Progress',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1 hour',
      notes: 'Current: com.grove.app - verify availability on stores'
    },
    {
      sequence: 17, priority: 'P0', phase: 'Pre-Launch', store: 'Android', category: 'Technical',
      activity: 'Configure App Signing (Android)',
      description: 'Generate and secure upload key for Play Store.',
      deliverable: 'Keystore file + backup',
      howTo: '1. EAS Build handles this automatically\n2. Or generate manually: keytool -genkey\n3. Store keystore securely (backup!)\n4. Never lose the keystore',
      dependencies: 'EAS or local build setup',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1-2 hours',
      notes: 'CRITICAL: Backup keystore. Loss = new app listing. EAS handles this.'
    },
    {
      sequence: 18, priority: 'P0', phase: 'Pre-Launch', store: 'iOS', category: 'Technical',
      activity: 'Configure App Signing (iOS)',
      description: 'Certificates and provisioning profiles.',
      deliverable: 'Certs + profiles',
      howTo: '1. EAS Build handles automatically\n2. Or manually: Create distribution certificate\n3. Create App Store provisioning profile\n4. Match bundle ID exactly',
      dependencies: 'Apple Developer Account',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1-2 hours',
      notes: 'EAS simplifies this significantly'
    },
    {
      sequence: 19, priority: 'P0', phase: 'Pre-Launch', store: 'Both', category: 'Technical',
      activity: 'Set Up EAS Build',
      description: 'Configure Expo Application Services for builds.',
      deliverable: 'eas.json configured',
      howTo: '1. Install eas-cli: npm install -g eas-cli\n2. Run: eas login\n3. Run: eas build:configure\n4. Configure eas.json for production builds\n5. Test with: eas build --platform all',
      dependencies: 'Expo account + Developer accounts',
      status: 'Done',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1-2 hours',
      notes: 'Already configured in eas.json with development, preview, production profiles'
    },
    {
      sequence: 20, priority: 'P0', phase: 'Pre-Launch', store: 'Android', category: 'Technical',
      activity: 'Create Production Build (Android)',
      description: 'Generate AAB file for Play Store.',
      deliverable: 'AAB file',
      howTo: '1. Update version in app.json\n2. Run: eas build --platform android --profile production\n3. Wait for build to complete\n4. Download AAB file',
      dependencies: 'EAS Build configured + App Signing',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '30-60 mins',
      notes: 'AAB required (not APK) for new apps on Play Store'
    },
    {
      sequence: 21, priority: 'P0', phase: 'Pre-Launch', store: 'iOS', category: 'Technical',
      activity: 'Create Production Build (iOS)',
      description: 'Generate IPA file for App Store.',
      deliverable: 'IPA file',
      howTo: '1. Update version in app.json\n2. Run: eas build --platform ios --profile production\n3. Wait for build to complete\n4. Submit directly or download IPA',
      dependencies: 'EAS Build configured + App Signing',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '30-60 mins',
      notes: 'Can submit directly from EAS to App Store Connect'
    },
    {
      sequence: 22, priority: 'P1', phase: 'Pre-Launch', store: 'Both', category: 'Technical',
      activity: 'Configure Push Notifications',
      description: 'Set up FCM and APNS for production.',
      deliverable: 'Push notifications working',
      howTo: '1. Create Firebase project (if not exists)\n2. Download google-services.json\n3. Create APNs key in Apple Developer\n4. Upload to Expo/EAS\n5. Test notifications',
      dependencies: 'Firebase account + Apple Developer',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '2-4 hours',
      notes: 'FCM is free. APNS included in dev account'
    },
    {
      sequence: 23, priority: 'P0', phase: 'Pre-Launch', store: 'Both', category: 'Technical',
      activity: 'Set Up In-App Analytics',
      description: 'Track user behavior, retention, and drop-off points.',
      deliverable: 'Analytics dashboard',
      howTo: '1. Integrate Mixpanel, Amplitude, or PostHog\n2. Track key events: signup, create_community, invite, event_create\n3. Set up funnels for core user journeys\n4. Create retention cohorts\n5. Set up dashboards for daily review',
      dependencies: 'Analytics account',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0-10000', costUSD: '0-120', timeline: '2-4 hours',
      notes: 'PostHog free: 1M events/mo. Mixpanel free: 100K events/mo. CRITICAL for understanding churn.'
    },
    {
      sequence: 24, priority: 'P1', phase: 'Pre-Launch', store: 'Both', category: 'Technical',
      activity: 'Set Up Error Monitoring',
      description: 'Configure Sentry or similar for production.',
      deliverable: 'Sentry configured',
      howTo: '1. Create Sentry project\n2. Add expo-sentry package\n3. Configure dsn and settings\n4. Test error reporting\n5. Set up alerts',
      dependencies: 'Sentry account',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1-2 hours',
      notes: 'Free tier: 5K errors/month'
    },
    {
      sequence: 25, priority: 'P0', phase: 'Pre-Launch', store: 'Both', category: 'Backend',
      activity: 'Configure Production Supabase',
      description: 'Ensure Supabase is production-ready.',
      deliverable: 'Production-ready Supabase',
      howTo: '1. Enable RLS on all tables\n2. Set up proper auth redirect URLs\n3. Configure rate limiting\n4. Set up database backups\n5. Review security policies',
      dependencies: 'Supabase project',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0-2000/mo', costUSD: '0-25/mo', timeline: '2-4 hours',
      notes: 'Free tier sufficient for launch. Upgrade as needed'
    },
    {
      sequence: 26, priority: 'P0', phase: 'Pre-Launch', store: 'Both', category: 'Backend',
      activity: 'Set Environment Variables',
      description: 'Configure production environment.',
      deliverable: 'Env vars configured',
      howTo: '1. Set SUPABASE_URL and ANON_KEY\n2. Configure GOOGLE_CLIENT_ID\n3. Set up API keys in EAS secrets\n4. Verify all production URLs',
      dependencies: 'Supabase + Auth providers',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1-2 hours',
      notes: 'Use EAS Secrets for sensitive values'
    },
    {
      sequence: 27, priority: 'P1', phase: 'Pre-Launch', store: 'Both', category: 'Marketing',
      activity: 'Set Up Feedback Board (Canny)',
      description: 'Collect feature requests and feedback from users.',
      deliverable: 'Canny board live',
      howTo: '1. Create Canny account (free tier)\n2. Set up feedback board categories\n3. Customize branding\n4. Add feedback link in app settings\n5. Configure email notifications for new feedback',
      dependencies: 'Canny account',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1-2 hours',
      notes: 'Canny free: 100 tracked users. Essential for product roadmap.'
    },
    {
      sequence: 28, priority: 'P2', phase: 'Pre-Launch', store: 'Android', category: 'Testing',
      activity: 'Internal Testing (Android)',
      description: 'Test with internal team before public.',
      deliverable: 'Internal test feedback',
      howTo: '1. Create internal test track in Play Console\n2. Upload AAB\n3. Add tester emails (up to 100)\n4. Share opt-in link\n5. Gather feedback',
      dependencies: 'Production build + Developer account',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '2-3 days',
      notes: 'Fastest approval, no review needed'
    },
    {
      sequence: 29, priority: 'P2', phase: 'Pre-Launch', store: 'iOS', category: 'Testing',
      activity: 'TestFlight Testing (iOS)',
      description: 'Beta testing with TestFlight.',
      deliverable: 'TestFlight feedback',
      howTo: '1. Upload build to App Store Connect\n2. Add internal testers (up to 100)\n3. Submit for external beta (up to 10,000)\n4. Gather feedback via TestFlight',
      dependencies: 'Production build + Developer account',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '3-5 days',
      notes: 'External TestFlight requires review'
    },
    {
      sequence: 30, priority: 'P0', phase: 'Launch', store: 'Android', category: 'Submission',
      activity: 'Complete Play Store Listing',
      description: 'Fill in all required store listing details.',
      deliverable: 'Store listing complete',
      howTo: '1. Upload app icon\n2. Upload feature graphic\n3. Upload professional screenshots\n4. Write optimized descriptions\n5. Complete content rating questionnaire\n6. Set pricing (free)\n7. Select countries',
      dependencies: 'All assets + Descriptions ready',
      status: 'Partial',
      documentation: 'grove-documentation/docs/operations/store-listing-android.md',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '2-3 hours',
      notes: 'Descriptions + Data Safety answers ready. Need screenshots + feature graphic.'
    },
    {
      sequence: 31, priority: 'P0', phase: 'Launch', store: 'iOS', category: 'Submission',
      activity: 'Complete App Store Listing',
      description: 'Fill in all App Store Connect details.',
      deliverable: 'Store listing complete',
      howTo: '1. Create new app in App Store Connect\n2. Upload screenshots for all sizes\n3. Write descriptions\n4. Add optimized keywords (100 chars max)\n5. Set pricing (free)\n6. Answer export compliance questions',
      dependencies: 'All assets + Descriptions ready',
      status: 'Partial',
      documentation: 'grove-documentation/docs/operations/store-listing-ios.md',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '2-3 hours',
      notes: 'Descriptions + Keywords + Privacy answers ready. Need screenshots.'
    },
    {
      sequence: 32, priority: 'P0', phase: 'Launch', store: 'Android', category: 'Submission',
      activity: 'Submit to Google Play Review',
      description: 'Submit app for Google Play review.',
      deliverable: 'App submitted',
      howTo: '1. Complete all store listing sections\n2. Upload AAB to production track\n3. Answer data safety questionnaire\n4. Submit for review\n5. Wait for approval (usually 1-3 days)',
      dependencies: 'Complete store listing + Build',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1-3 days',
      notes: 'First review may take longer'
    },
    {
      sequence: 33, priority: 'P0', phase: 'Launch', store: 'iOS', category: 'Submission',
      activity: 'Submit to App Store Review',
      description: 'Submit app for App Store review.',
      deliverable: 'App submitted',
      howTo: '1. Complete all App Store Connect sections\n2. Upload build via EAS or Transporter\n3. Select build for review\n4. Answer review questions\n5. Submit for review (usually 1-2 days)',
      dependencies: 'Complete store listing + Build',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1-7 days',
      notes: 'First review may take longer. Common rejections: crashes, broken links'
    },
    {
      sequence: 34, priority: 'P1', phase: 'Launch', store: 'Both', category: 'Submission',
      activity: 'Respond to Review Feedback',
      description: 'Handle rejection or requests.',
      deliverable: 'Issues resolved',
      howTo: '1. Read rejection reason carefully\n2. Fix issues mentioned\n3. Submit updated build\n4. Write explanation in Resolution Center\n5. Resubmit for review',
      dependencies: 'Reviewer feedback',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1-3 days',
      notes: 'Keep response professional and detailed'
    },
    {
      sequence: 35, priority: 'P0', phase: 'Post-Launch', store: 'Both', category: 'Engagement',
      activity: 'Set Up Welcome Email Sequence',
      description: 'Onboard new users and drive engagement.',
      deliverable: 'Email sequence live',
      howTo: '1. Use Loops.so for email automation\n2. Welcome email (immediate): Thank user, highlight key features\n3. Day 2: How to create your first community\n4. Day 5: Tips for engaging members\n5. Day 7 inactivity: Ask for feedback, offer help\n6. Day 14: Feature education (events, finance)\n7. Day 30: Ask for app store review',
      dependencies: 'Loops.so account + Email templates',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0-4000', costUSD: '0-50', timeline: '2-3 days',
      notes: 'Loops.so free: 1000 contacts. Email sequences increase retention 30%+'
    },
    {
      sequence: 36, priority: 'P1', phase: 'Post-Launch', store: 'Both', category: 'Marketing',
      activity: 'Create Landing Page',
      description: 'Website for app promotion and SEO.',
      deliverable: 'Landing page live',
      howTo: '1. Create simple landing page (Framer/Carrd.co free)\n2. Include screenshots and features\n3. Add store badges with links\n4. Add privacy policy link\n5. Set up domain (optional)',
      dependencies: 'Published app',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0-5000', costUSD: '0-60', timeline: '1-2 days',
      notes: 'Can use free hosting initially'
    },
    {
      sequence: 37, priority: 'P1', phase: 'Post-Launch', store: 'Both', category: 'Marketing',
      activity: 'Set Up Social Media Presence',
      description: 'Create presence for Grove.',
      deliverable: 'Social accounts created',
      howTo: '1. Create Twitter/X account (@GroveCommunity)\n2. Create Instagram account\n3. Create LinkedIn page (optional)\n4. Plan content calendar\n5. Share updates, tips, and user stories',
      dependencies: 'Published app',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1-2 days',
      notes: 'Organic social is free'
    },
    {
      sequence: 38, priority: 'P2', phase: 'Post-Launch', store: 'iOS', category: 'Marketing',
      activity: 'Set Up App Store Optimization (ASO)',
      description: 'Ongoing optimization for store visibility.',
      deliverable: 'ASO process established',
      howTo: '1. Monitor keyword rankings weekly\n2. A/B test icons and screenshots\n3. Encourage ratings and reviews\n4. Respond to all user reviews\n5. Update keywords based on performance data',
      dependencies: 'Published app + ASO tool',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0-8000/mo', costUSD: '0-100/mo', timeline: 'Ongoing',
      notes: 'AppTweak or SensorTower for tracking'
    },
    {
      sequence: 39, priority: 'P1', phase: 'Post-Launch', store: 'Both', category: 'Marketing',
      activity: 'Launch Day Social Campaign',
      description: 'Maximize visibility on launch day.',
      deliverable: 'Launch campaign executed',
      howTo: '1. Prepare launch announcement posts\n2. Email waitlist with download links\n3. Post on Product Hunt (optional)\n4. Share in relevant communities (Reddit, Facebook groups)\n5. Reach out to early adopters for reviews',
      dependencies: 'Published app + Social accounts',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0-3000', costUSD: '0-35', timeline: '1 day',
      notes: 'Product Hunt can drive significant traffic'
    },
    {
      sequence: 40, priority: 'P2', phase: 'Post-Launch', store: 'Both', category: 'Marketing',
      activity: 'Content Marketing Strategy',
      description: 'Build organic traffic through content.',
      deliverable: 'Content plan',
      howTo: '1. Start a blog (Medium or own site)\n2. Write about community management tips\n3. Case studies of successful communities\n4. SEO-optimized articles\n5. Share on social media',
      dependencies: 'Website/blog platform',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0-5000', costUSD: '0-60', timeline: 'Ongoing',
      notes: 'Long-term strategy. Takes 3-6 months to see results'
    },
    {
      sequence: 41, priority: 'P1', phase: 'Post-Launch', store: 'Both', category: 'Marketing',
      activity: 'Influencer/Community Outreach',
      description: 'Partner with community leaders.',
      deliverable: 'Partnerships established',
      howTo: '1. Identify local community group leaders\n2. Offer free premium features for testimonials\n3. Create case studies together\n4. Get video testimonials\n5. Feature on landing page',
      dependencies: 'Published app + Relationship building',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0-15000', costUSD: '0-180', timeline: 'Ongoing',
      notes: 'Word of mouth is powerful for community apps'
    },
    {
      sequence: 42, priority: 'P1', phase: 'Post-Launch', store: 'Both', category: 'Operations',
      activity: 'Set Up Customer Support',
      description: 'Handle user questions and issues.',
      deliverable: 'Support system live',
      howTo: '1. Create support email (support@grove.app)\n2. Set up FAQ/Help section in app\n3. Configure auto-replies\n4. Create response templates\n5. Monitor reviews for issues',
      dependencies: 'Email setup',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0-3000/mo', costUSD: '0-35/mo', timeline: '1-2 days',
      notes: 'Start with free email. Intercom later'
    },
    {
      sequence: 43, priority: 'P1', phase: 'Post-Launch', store: 'Both', category: 'Operations',
      activity: 'Set Up Review Monitoring',
      description: 'Track and respond to store reviews.',
      deliverable: 'Review monitoring active',
      howTo: '1. Enable email notifications in store consoles\n2. Use AppFollow or similar (optional)\n3. Respond to negative reviews within 24h\n4. Thank positive reviewers\n5. Track trends and common issues',
      dependencies: 'Published app',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0-5000/mo', costUSD: '0-60/mo', timeline: 'Ongoing',
      notes: 'Manual monitoring is free. Reviews impact ranking.'
    },
    {
      sequence: 44, priority: 'P1', phase: 'Post-Launch', store: 'Both', category: 'Operations',
      activity: 'Create Release Process',
      description: 'Standard process for updates.',
      deliverable: 'Release process documented',
      howTo: '1. Document version numbering scheme\n2. Create release checklist\n3. Set up staging environment\n4. Plan testing before each release\n5. Communicate updates to users',
      dependencies: 'Published app',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1 day',
      notes: 'Document in team wiki/docs'
    },
    {
      sequence: 45, priority: 'P1', phase: 'Post-Launch', store: 'Both', category: 'Growth',
      activity: 'In-App Review Prompts',
      description: 'Ask happy users for reviews at right moments.',
      deliverable: 'Review prompts implemented',
      howTo: '1. Integrate expo-store-review\n2. Trigger after positive moments (event success, milestone)\n3. Don\'t ask too early (wait 7+ days)\n4. Respect user choice (don\'t ask again if declined)\n5. A/B test timing',
      dependencies: 'Published app',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '2-4 hours',
      notes: 'Good reviews boost ranking significantly'
    },
    {
      sequence: 46, priority: 'P2', phase: 'Post-Launch', store: 'Both', category: 'Growth',
      activity: 'Set Up Referral Program',
      description: 'In-app referral for organic growth.',
      deliverable: 'Referral system live',
      howTo: '1. Design referral flow (unique invite links)\n2. Track referrals in Supabase\n3. Reward referrers (premium features/recognition)\n4. Show referral leaderboard\n5. Promote within app',
      dependencies: 'App with user base',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0-5000', costUSD: '0-60', timeline: '3-5 days',
      notes: 'Can implement with Supabase. Most powerful growth lever.'
    },
    {
      sequence: 47, priority: 'P2', phase: 'Post-Launch', store: 'Both', category: 'Growth',
      activity: 'Community Building (Meta)',
      description: 'Build a community for Grove users.',
      deliverable: 'User community created',
      howTo: '1. Create Discord/Slack for power users\n2. Host virtual meetups/webinars\n3. Share best practices and tips\n4. Gather feedback directly\n5. Create ambassador program',
      dependencies: 'Published app + Community platform',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: 'Ongoing',
      notes: 'Meta-community of community organizers'
    },
    {
      sequence: 48, priority: 'P2', phase: 'Post-Launch', store: 'Both', category: 'Compliance',
      activity: 'GDPR Compliance',
      description: 'European data protection requirements.',
      deliverable: 'GDPR compliant',
      howTo: '1. Add cookie consent (if web)\n2. Allow data export from settings\n3. Allow account deletion\n4. Document data processing\n5. Update privacy policy',
      dependencies: 'Privacy Policy + App functionality',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0-8000', costUSD: '0-100', timeline: '2-3 days',
      notes: 'Required if targeting EU users'
    },
    {
      sequence: 49, priority: 'P2', phase: 'Post-Launch', store: 'Both', category: 'Compliance',
      activity: 'COPPA Compliance',
      description: 'If app may be used by children.',
      deliverable: 'COPPA assessment',
      howTo: '1. Determine if app targets children\n2. Add age verification if needed\n3. Limit data collection from minors\n4. Update privacy policy',
      dependencies: 'Privacy Policy',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1 day',
      notes: 'Grove targets adults (community organizers)'
    },
    {
      sequence: 50, priority: 'P3', phase: 'Post-Launch', store: 'Both', category: 'Growth',
      activity: 'Localization',
      description: 'Translate app for new markets.',
      deliverable: 'Localized app versions',
      howTo: '1. Identify target markets (Hindi, Tamil, etc.)\n2. Extract strings for translation\n3. Use professional translators or Lokalise\n4. Update store listings per language\n5. Test with native speakers',
      dependencies: 'Published app + Translation service',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '10000-50000', costUSD: '120-600', timeline: '1-2 weeks',
      notes: 'Can significantly expand market. Start with 1-2 languages.'
    },
    {
      sequence: 51, priority: 'P3', phase: 'Post-Launch', store: 'Both', category: 'Growth',
      activity: 'PR and Media Outreach',
      description: 'Get press coverage for credibility.',
      deliverable: 'Media coverage',
      howTo: '1. Write press release\n2. Create media kit (screenshots, logos, story)\n3. Identify relevant tech/local journalists\n4. Pitch story angle (local community revival)\n5. Prepare for interviews',
      dependencies: 'Published app + Media kit',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0-25000', costUSD: '0-300', timeline: 'Ongoing',
      notes: 'PR can be expensive. Start with organic outreach.'
    },
    {
      sequence: 52, priority: 'P3', phase: 'Post-Launch', store: 'Both', category: 'Monetization',
      activity: 'Plan Premium Features',
      description: 'Roadmap for monetization.',
      deliverable: 'Monetization plan',
      howTo: '1. Analyze free tier usage\n2. Identify power user features (analytics, export)\n3. Design subscription tiers\n4. Integrate Stripe/RevenueCat\n5. A/B test pricing',
      dependencies: 'Published app + User data',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '5000-15000', costUSD: '60-180', timeline: '2-4 weeks',
      notes: 'Wait until you have active users. Don\'t rush monetization.'
    },
    {
      sequence: 53, priority: 'P1', phase: 'Post-Launch', store: 'Both', category: 'Analytics',
      activity: 'Set Up Funnel Tracking',
      description: 'Understand where users drop off.',
      deliverable: 'Funnels configured',
      howTo: '1. Define key funnels: Signup > Create Community > Invite > First Event\n2. Track each step in analytics\n3. Identify biggest drop-off points\n4. Create weekly funnel reports\n5. Prioritize improvements based on data',
      dependencies: 'In-app analytics set up',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1-2 days',
      notes: 'Critical for understanding user behavior'
    },
    {
      sequence: 54, priority: 'P1', phase: 'Post-Launch', store: 'Both', category: 'Analytics',
      activity: 'Retention Analysis',
      description: 'Track cohort retention to measure product health.',
      deliverable: 'Retention dashboard',
      howTo: '1. Set up cohort analysis in analytics tool\n2. Track Day 1, Day 7, Day 30 retention\n3. Compare retention by acquisition source\n4. Identify features that correlate with retention\n5. Focus on improving D7 retention first',
      dependencies: 'In-app analytics set up',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1 day',
      notes: 'Retention is the key metric for product-market fit'
    },
    {
      sequence: 55, priority: 'P1', phase: 'Post-Launch', store: 'Both', category: 'Analytics',
      activity: 'Weekly Analytics Review',
      description: 'Regular check on app health.',
      deliverable: 'Weekly review process',
      howTo: '1. Schedule weekly 30-min review\n2. Check: DAU/WAU, new signups, retention\n3. Review funnel drop-offs\n4. Read new feedback/reviews\n5. Prioritize action items',
      dependencies: 'Analytics + Feedback tools',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: 'Ongoing',
      notes: 'Discipline to review data regularly is key'
    },
    {
      sequence: 56, priority: 'P0', phase: 'Pre-Launch', store: 'iOS', category: 'Compliance',
      activity: 'Complete App Privacy Details (iOS)',
      description: 'Fill out App Store Connect privacy labels based on data collection and usage.',
      deliverable: 'App Privacy section completed',
      howTo: 'App Store Connect > App Privacy > answer data types, tracking, data linked to user. Align with privacy policy.',
      dependencies: 'Privacy Policy completed',
      status: 'Done',
      documentation: 'grove-documentation/docs/operations/store-listing-ios.md',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1 day',
      notes: 'Pre-filled answers provided in documentation. Required for App Review.'
    },
    {
      sequence: 57, priority: 'P0', phase: 'Pre-Launch', store: 'Android', category: 'Compliance',
      activity: 'Complete Data Safety Form (Android)',
      description: 'Declare data collection, sharing, and security practices in Play Console.',
      deliverable: 'Data Safety form submitted',
      howTo: 'Play Console > App content > Data safety. Map to privacy policy and SDKs used.',
      dependencies: 'Privacy Policy completed',
      status: 'Done',
      documentation: 'grove-documentation/docs/operations/store-listing-android.md',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1 day',
      notes: 'Pre-filled answers provided in documentation. Required before production release.'
    },
    {
      sequence: 58, priority: 'P0', phase: 'Pre-Launch', store: 'Both', category: 'Submission',
      activity: 'Prepare App Review Notes + Demo Account',
      description: 'Provide reviewer instructions and test credentials if login is required.',
      deliverable: 'Review notes + test account',
      howTo: 'Create reviewer account, list steps to access core features, add in App Store Connect and Play Console.',
      dependencies: 'Working build + QA sign-off',
      status: 'Done',
      documentation: 'grove-documentation/docs/operations/app-review-notes.md',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1 day',
      notes: 'Complete instructions for both stores + SQL script for demo data setup.'
    },
    {
      sequence: 59, priority: 'P1', phase: 'Pre-Launch', store: 'Both', category: 'Technical',
      activity: 'Add Support & Marketing URLs',
      description: 'Set Support URL and Marketing URL in store listings.',
      deliverable: 'Support + Marketing URLs live',
      howTo: 'Use landing page or docs site. Ensure privacy policy URL is reachable.',
      dependencies: 'Landing page or docs hosting',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0-1500', costUSD: '0-18', timeline: '1 day',
      notes: 'Support URL is mandatory for iOS.'
    },
    {
      sequence: 60, priority: 'P1', phase: 'Pre-Launch', store: 'Both', category: 'Testing',
      activity: 'Release Build Smoke Test',
      description: 'Install the production build and complete critical flows end-to-end.',
      deliverable: 'Signed QA checklist',
      howTo: 'Test login, community creation, invite/join, events, feed, finance, profile.',
      dependencies: 'Production build ready',
      status: 'Done',
      documentation: 'grove-documentation/docs/operations/smoke-test-checklist.md',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1 day',
      notes: '50+ test cases with sign-off sheet. Prevents last-minute store rejections.'
    },
    {
      sequence: 61, priority: 'P1', phase: 'Pre-Launch', store: 'iOS', category: 'Compliance',
      activity: 'App Tracking Transparency (if tracking)',
      description: 'Show ATT prompt if any tracking is used; otherwise document why not needed.',
      deliverable: 'ATT prompt or N/A note',
      howTo: 'If using tracking SDKs, add ATT prompt and update privacy labels.',
      dependencies: 'Analytics/SDK list finalized',
      status: 'Not Started',
      documentation: '',
      owner: '', targetDate: '',
      costINR: '0', costUSD: '0', timeline: '1 day',
      notes: 'Required if tracking users across apps/sites.'
    },
  ];

  // Add data rows
  data.forEach(row => {
    worksheet.addRow(row);
  });

  // Style header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2D6A4F' } // Grove green
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  headerRow.height = 35;

  // Color coding for status
  const statusColors = {
    'Done': { bg: 'FF28A745', font: 'FFFFFFFF' },      // Green
    'Partial': { bg: 'FFFFC107', font: 'FF000000' },   // Yellow
    'In Progress': { bg: 'FF17A2B8', font: 'FFFFFFFF' }, // Blue
    'Not Started': { bg: 'FFF8F9FA', font: 'FF6C757D' }  // Light gray
  };

  // Priority colors
  const priorityColors = {
    'P0': { bg: 'FFDC3545', font: 'FFFFFFFF' },  // Red - Critical
    'P1': { bg: 'FFFD7E14', font: 'FFFFFFFF' },  // Orange - High
    'P2': { bg: 'FFFFC107', font: 'FF000000' },  // Yellow - Medium
    'P3': { bg: 'FF6C757D', font: 'FFFFFFFF' }   // Gray - Low
  };

  // Phase colors
  const phaseColors = {
    'Pre-Launch': { bg: 'FFE3F2FD', font: 'FF1565C0' },  // Light blue
    'Launch': { bg: 'FFFFF3E0', font: 'FFE65100' },      // Light orange
    'Post-Launch': { bg: 'FFE8F5E9', font: 'FF2E7D32' }  // Light green
  };

  // Category colors
  const categoryColors = {
    'Legal': 'FFE8EAF6',
    'Accounts': 'FFFCE4EC',
    'Marketing': 'FFF3E5F5',
    'Branding': 'FFEDE7F6',
    'Assets': 'FFE1F5FE',
    'Content': 'FFE0F7FA',
    'Technical': 'FFE0F2F1',
    'Backend': 'FFE8F5E9',
    'Testing': 'FFFFF8E1',
    'Submission': 'FFFFF3E0',
    'Engagement': 'FFFBE9E7',
    'Operations': 'FFEFEBE9',
    'Growth': 'FFF1F8E9',
    'Compliance': 'FFECEFF1',
    'Analytics': 'FFFAFAFA',
    'Monetization': 'FFFFEBEE'
  };

  // Apply styles to data rows
  for (let i = 2; i <= data.length + 1; i++) {
    const row = worksheet.getRow(i);
    row.alignment = { vertical: 'top', wrapText: true };
    row.height = 60;

    // Alternate row colors
    if (i % 2 === 0) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFAFAFA' }
      };
    }

    // Status column styling (column 11)
    const statusCell = row.getCell(11);
    const statusStyle = statusColors[statusCell.value] || statusColors['Not Started'];
    statusCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: statusStyle.bg }
    };
    statusCell.font = { color: { argb: statusStyle.font }, bold: true };
    statusCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Priority column styling (column 2)
    const priorityCell = row.getCell(2);
    const priorityStyle = priorityColors[priorityCell.value] || priorityColors['P3'];
    priorityCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: priorityStyle.bg }
    };
    priorityCell.font = { color: { argb: priorityStyle.font }, bold: true };
    priorityCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Phase column styling (column 3)
    const phaseCell = row.getCell(3);
    const phaseStyle = phaseColors[phaseCell.value] || phaseColors['Pre-Launch'];
    phaseCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: phaseStyle.bg }
    };
    phaseCell.font = { color: { argb: phaseStyle.font } };
    phaseCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Category column styling (column 5)
    const categoryCell = row.getCell(5);
    const categoryBg = categoryColors[categoryCell.value] || 'FFFFFFFF';
    categoryCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: categoryBg }
    };
    categoryCell.alignment = { horizontal: 'center', vertical: 'middle' };
  }

  // Add borders to all cells
  const borderStyle = {
    top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
    left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
    bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
    right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
  };

  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = borderStyle;
    });
  });

  // Add summary sheet
  const summarySheet = workbook.addWorksheet('Summary', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  });

  summarySheet.columns = [
    { header: 'Metric', key: 'metric', width: 30 },
    { header: 'Value', key: 'value', width: 15 },
  ];

  const totalTasks = data.length;
  const doneTasks = data.filter(d => d.status === 'Done').length;
  const partialTasks = data.filter(d => d.status === 'Partial').length;
  const inProgressTasks = data.filter(d => d.status === 'In Progress').length;
  const notStartedTasks = data.filter(d => d.status === 'Not Started').length;

  const p0Tasks = data.filter(d => d.priority === 'P0').length;
  const p0Done = data.filter(d => d.priority === 'P0' && (d.status === 'Done' || d.status === 'Partial')).length;

  const summaryData = [
    { metric: 'Total Tasks', value: totalTasks },
    { metric: 'Done', value: doneTasks },
    { metric: 'Partial', value: partialTasks },
    { metric: 'In Progress', value: inProgressTasks },
    { metric: 'Not Started', value: notStartedTasks },
    { metric: '', value: '' },
    { metric: 'Overall Progress', value: `${Math.round((doneTasks + partialTasks * 0.5) / totalTasks * 100)}%` },
    { metric: '', value: '' },
    { metric: 'P0 (Critical) Tasks', value: p0Tasks },
    { metric: 'P0 Complete/Partial', value: p0Done },
    { metric: 'P0 Progress', value: `${Math.round(p0Done / p0Tasks * 100)}%` },
  ];

  summaryData.forEach(row => summarySheet.addRow(row));

  // Style summary header
  const summaryHeader = summarySheet.getRow(1);
  summaryHeader.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  summaryHeader.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2D6A4F' }
  };

  // Style summary values
  for (let i = 2; i <= summaryData.length + 1; i++) {
    const row = summarySheet.getRow(i);
    row.font = { size: 12 };
    if (row.getCell(1).value === 'Overall Progress' || row.getCell(1).value === 'P0 Progress') {
      row.font = { bold: true, size: 14 };
    }
  }

  // Save the workbook
  await workbook.xlsx.writeFile('./app-store-launch-checklist.xlsx');
  console.log('Excel file created: app-store-launch-checklist.xlsx');
}

generateChecklist().catch(console.error);
