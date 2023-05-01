<div align='center'>
  <img src="https://universe-list.xyz/img/icon.png" height='100px' width='100px' />
  <h1>Universe List</h1>
  <h3>The Ultimate Discord List for Bots and Servers!</h3>
</div>
<!---
<br></br>
> # **⚠️ Universe List Release!**<br>
> Our fantastic team has just recently released Universe List, which means that there **WILL BE** many bugs. [Join our Discord Server](https://discord.gg/PXdJjTF6yS) or [Email Us](mailto:ishaan@ishaantek.com) to report any issues / bugs!
-->

## Installation

This is for users who want to contribute to Universe List, or even run a self hosted instance of Universe List.

1. Download the code. In the web version of GitHub, you can do that by clicking the green "Code" button, and then "Download ZIP".
2. Unzip it, and open it in code.
3. Run the command `npm i` in the terminal.
4. Fill out the `.env.template` file with your information, and then rename the file to `.env`.
5. Fill out the information in the `config.js` file.
6. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and go to the main bot. 
7. Go to the `0Auth2` section and set the following URLs under `Redirects`.<br>
･ https://example.com/auth/callback<br>
･ https://example.com/auth/callback/joinSupport<br>
Make sure to change `example.com` with your domain.
8. Start the project with `npm start`.

## Terms of Use
  * You have the permission to shoot and share videos, but you have to mention us and our server in the video.</a><br>
  * You cannot use our branding anywhere on your site & claim it as your own.</a><br>
  * You have the permission to share in writing, but you have to mention us, our server, in the article.</a><br>
  * You can't speak in a "we did it" way.</a><br>
  * You cannot sell the code.</a><br>
  * Don't touch this part on footer:</a><br>
```
Copyright © 2023 Universe List, All Rights Reserved.
```

## To-Do

Universe List is in a continuous state of development. New features/updates may come at any time. Some pending ideas are:

  * Bot Widgets.
  * Bots with uptime of less than 75% should be removed.
  * Co-owner feature to bots.
  * Add delete/edit/reply features for bot reviews.

## Config

  * The domain variable should includes the protocol and **doesn't end** with a `/`. Eg, `http://localhost:8080`.
  * All the roles should be below the role of the bot that controls the list.
  * Most of the variables are Discord IDs.
  * The MongoDB URL can be either a local server or a remote one. Atlas provides a free tier with 500mb.
  * The minimum and maximum lengths for bot / server description and summary are in characters.

## License

Released under the [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html) license.

---

## Contributors ✨
<a href="https://github.com/ishaantek/UniverseList/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ishaantek/UniverseList"/>
</a>
