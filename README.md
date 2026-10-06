# gjwhite.com

The website for Gayle Jessup White: plain HTML, CSS and a little JavaScript. There is nothing to install or build. Upload the folder to any static host and it works.

## What's in the folder

| File | What it is |
|---|---|
| `index.html` | Homepage: hero, praise, Books, In the News, About, Speaking, Q&A, Contact |
| `about.html` | Biography and photo gallery |
| `404.html` | "Page not found" page (most hosts use it automatically) |
| `css/styles.css` | All styling, including the colors |
| `js/news.js` | **The In the News list.** Edit this to add or change stories |
| `js/main.js` | Mobile menu, news cards, contact form, gallery lightbox |
| `images/` | Photos, book cover, social-share image (`og-image.jpg`) |
| `favicon.svg`, `robots.txt`, `sitemap.xml` | Browser icon and search-engine files |

## Preview it on your computer

Double-click `index.html` and it opens in your browser. Everything works this way except sending the contact form.

## Before launch: fill in the placeholders

Anything in [square brackets] is a placeholder. To list them all, open a terminal in this folder and run:

```
grep -rn "\[" --include=*.html --include=news.js .
```

They are:

- **index.html**
  - Working title and description of the new book
  - TV career: stations and highlights
  - Q&A answers (marked "Gayle to confirm," "Gayle's own summary," and so on)
  - "Replies within [X] business days" (it appears twice: under the form and in the form's `data-success` thank-you message)
  - Book-buying links: the four `href="#"` buttons under Reclamation
  - Social links: Instagram, X / Twitter, LinkedIn (`href="#"`; delete any she doesn't use)
- **js/news.js**: dates, headlines and channel names for the Richmond Times-Dispatch column and the two YouTube videos
- **about.html**: gallery captions (`data-caption="[...]"`)

The homepage photo of Gayle at Monticello (`images/gayle-monticello.jpg`) is only 404 pixels wide, so it can look soft on high-resolution screens. If a larger original exists, save it over that file, ideally at least 900 pixels wide.

## Updating In the News

Open `js/news.js` in any text editor. Each story is a block like this:

```js
{
  kind: "Video",
  date: "Oct 2026",
  outlet: "PBS NewsHour",
  title: "Headline goes here",
  url: "https://example.com/story",
  summary: "Optional short description."
},
```

Copy a block, paste it where you want it (the list shows in order, top first), and change the text. Add `featured: true` to make a card full width. Keep the comma after each block's closing `}`.

## Contact form

The form needs a service to receive submissions and email them to Gayle. It is set up for **Formspree**, and any similar service works.

### Formspree (as set up)

1. Create a free account at formspree.io and a new form. Set the notification email to gaylejessupwhite@gmail.com.
2. Copy the form's ID (the part after `/f/` in its endpoint, such as `xyzabcd`).
3. In `index.html`, find `https://formspree.io/f/YOUR_FORM_ID` and replace `YOUR_FORM_ID` with that ID.
4. Publish, then send a test message from a phone. Check Gmail's spam folder the first time.

Already included:

- A hidden "honeypot" field named `_gotcha`. Formspree drops any submission where a bot fills it in.
- A `_subject` field, so emails arrive as "New message from gjwhite.com."
- The sender's email address in the `email` field, so Gayle can hit Reply.
- A thank-you message on the page after sending, and an error message that offers the email address if sending fails.
- Until `YOUR_FORM_ID` is replaced, the form tells visitors to email Gayle directly rather than failing silently.

### Using Web3Forms instead

1. Change the form's `action` to `https://api.web3forms.com/submit`.
2. Add `<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY">` inside the form.
3. Rename the honeypot field from `_gotcha` to `botcheck`.

Check Web3Forms' docs for its current field names.

### Extra spam protection: Cloudflare Turnstile (optional)

Turnstile is Cloudflare's free, usually invisible CAPTCHA, and it works on any host. Two lines in `index.html` are commented out and ready:

1. Get a site key at dash.cloudflare.com, under Turnstile.
2. Uncomment the `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js">` line in the `<head>`.
3. Uncomment the `cf-turnstile` block inside the form and paste in your site key.

The widget adds a token to each submission, and someone has to verify that token with Cloudflare using your **secret key**. Some form services can do this for you; check whether yours supports Turnstile and where to enter the secret key. If it doesn't, the honeypot alone handles most bot spam.

## Changing the color scheme

At the top of each HTML file is `<html lang="en" data-theme="navy">`. Change `navy` to `parchment` in `index.html`, `about.html` and `404.html` to switch to the Parchment & burgundy palette. The colors themselves are at the top of `css/styles.css`.

## Adding gallery photos

In `about.html`, each photo is a `<button class="gallery__item">` block:

1. Save a small version (about 900 px on the long side) and a large version (about 1800 px) in `images/gallery/`.
2. Copy an existing block and update:
   - `src` (small image) and `data-full` (large image)
   - `width` and `height` (the small image's pixel size)
   - `--ar` (width divided by height)
   - `data-title`, `data-caption`, `data-credit`
   - `data-alt` (a description for screen readers)
   - `aria-label`

Three or four photos fit well in one row on desktop. On phones they stack.

## Hosting

The site is static, so any of these work:

- **Cloudflare Pages / Netlify:** create a project and drag in this folder, or connect a GitHub repository holding it. Then add the custom domain `gjwhite.com` and follow their DNS instructions. HTTPS is automatic.
- **GitHub Pages:** push the folder to a repository and turn on Pages in Settings.
- **Railway:** deploy the folder as a static site. For example, add a `Dockerfile` with `FROM nginx:alpine` and `COPY . /usr/share/nginx/html`, or use a static-site template. Then add `gjwhite.com` under the service's custom domain settings and update DNS.

After launch:

- Submit `https://gjwhite.com/sitemap.xml` in Google Search Console.
- Check how a link preview looks by pasting the URL into a social post draft.

## Fonts

The fonts load from Google Fonts: Cormorant Garamond for headings, Source Serif 4 for body text, and Libre Franklin for labels and buttons. No other outside services are used except the form service, and Turnstile if you turn it on.
