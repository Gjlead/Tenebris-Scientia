# Tenebris scientia
#### Video Demo:  https://youtu.be/qrPxo4nDQqE
#### Description:
As my final project I have created a website for **Tenebris scientia**, a fictional magical university specializing in the dark arts, open to young magical individuals who where cast out for being different. On this website you can find information about the university itself, read news about the fictional world we are situated in, check out this year's winners of the annual poetry competition and - most important! - choose your own mix of ingredients for a potion in the **potion shop**.

The idea for my final project has been around for some time, and I used week 8's assignment of creating a small test website to create a slimmed-down version of it as preparation for the real deal. In addition to all sorts of other details about the university's magical environment, this "final project version" of the website also includes its centerpiece: the potion shop. But more on that later.

This website project is a wonderful presentation of what I have learned with cs50 over the last few months. In its implementation, I used a wild mixture of HTML, CSS, JavaScript, Bootstrap, Flask, Jinja and SQL, using pretty much everything we came across in the previous assignments apart from C and Scratch.

Let's take a look at the project files in detail.

On the top-most level we have the project folder itself, containing a python file, a database, this readme and two folders, one called static, the other one called templates.

## templates
This folder contains all the HTML files used for the project. In week 8 much of my HTML was repeated in each HTML file, with a whole lot of tedious copy&paste going on whenever I changed a small detail in the menu bar that was supposed to be visible and look the same on every page. Later on we learned about Flask, and I happily started using it when work began on the final project. Now we have a layout.html, which contains everything that is used by each of the website's pages, like scripts and stylesheets and the menu top bar with links to the other pages.

This ensures that the other HTML files are smaller and more manageable, as they now only require the HTML for their specific content.

There are three other things I want to showcase in this section.

### 1. The Bootstrap carousel in index.html.

Carousels have been all the rage on various websites for years, I hardly know any that don't sport at least one. Naturally, my university needed one too. Bootstrap offers an uncomplicated way to implement a carousel - only the styling of the control elements can be a bit tricky when working with it for the first time. Basically, such a Bootstrap carousel on my website consists of carousel-items that each contain a blockquote class, in which a quote about the university and the author of the quote can be inserted. A pitfall for me was that I initially worked with Bootstrap version 4 and later switched to version 5 for the collapsibles that I needed for the potion shop, and Bootstrap switched from attribute names such as "data-target" to "data-bs-target", which destroyed all my Bootstrap elements for some time until I understood what had happened.

### 2. The extremely short news.html, which only contains a headline and a class called "newsLong".

At first glance, the news page looks pretty bare. To avoid confusion, I'll briefly mention it here, but I'll explain in detail what's going on when we get to the JavaScript files. Very briefly: Both the home page and the news page contain news about the university and the world around it. However, the home page only contains shortened teasers that can be followed by a link to the complete news articles on the news page. In order to be able to easily add new news items at any time and calculate their date, these are generated with JavaScript and then inserted into the HTML class. In this way, I only have to work in one place instead of several when making changes to the news.

### 3. The most complex of my HTML files, potionStore.html.

The potion shop is the most important part of my project and brings in the complexity that is necessary to be able to call the whole thing my final project. The page consists of a large container that contains the ingredient filters, the ingredient list and the shopping cart. The ingredient list is filled from a small, specially created database using Jinja. On the left-hand side, various ingredients can be filtered in or out using checkboxes. A click on such a checkbox transmits the information which filters are activated via AJAX fetch request to the Python file, and receives the results of an SQL query adapted to these filters in JSON format, with which the displayed ingredient list is then immediately updated without the need for a page refresh.

The ingredients selected in the center end up in the shopping cart on the right-hand side. At the bottom, the price of the potion is recalculated and displayed with each ingredient added or removed.

## ingredients.db
A small database containing 19 different ingredients for the potion shop. In addition to their unique ID, ingredients have a name, description, effect, price and information on whether they are a base ingredient and whether they are vegan, poisonous, sourced in a dubious way or just taste downright disgusting.

## app.py
The Python file enables us to render the HTML templates with Flask and to handle the database. In addition to information for the store page about which ingredients need to be displayed, it contains two functions that are useful for updating the ingredient list when using filters and for calculating prices.

The update_Filter function receives the information about which filter checkboxes have been clicked and generates a corresponding SQL query to the ingredients database in order to return this information to the website in JSON format.

## static
This folder contains the logo of the university, the JavaScript files and the stylesheet used by all pages.

The logo was created with Craiyon (see [craiyon.com](https://www.craiyon.com/)), which is also referenced accordingly in a disclaimer on the about page.

Most of the stylesheet is self-explanatory. I have globally defined the text alignment and the desired font family including fallback options, and then styled things as I like them. The university colors are dark red and grey, which is reflected in both the logo and the stylesheet. I'd like to pay special attention to the responsive design, which I've been struggling with for a while, especially in the potion shop. In the "week 8 version", the menu bar with the links to the individual pages was in vertical form under the university logo, which caused problems with very small screen sizes such as on smartphones because the text of the page started clipping into the menu. So I decided to create a red bar at the top of the website with the logo, the name of the university and the menu items. And if the screen becomes too small, the menu items are grouped together in a collapsible.

The store was more complicated. The page itself should not be scrollable. Instead, you should be able to scroll within the fixed containers if necessary, so that, for example, the filters do not disappear at the top of the page while you scroll down to discover more ingredients. The width of the page was also difficult. I absolutely needed the filters as well as the ingredient list and the shopping cart, but there was simply no more room for everything together once the page had shrinked down to a certain width. In the end, I decided to first shrink the width of the ingredients list until I ran the risk of making it ugly, then remove the filters completely and divide the resulting space between the ingredients list and the shopping cart. I solved the problem of the disappearing filters by then displaying a filter button which can be used to expand a collapsible that makes the filters selectable again.

The only thing I couldn't salvage on small smartphone screens was the carousel on the home page. The long quotes in it are simply too bulky, which is why the entire carousel is hidden as a precaution on screens that are too small.

Last but not least are the JavaScript files. As already mentioned, the news section is compiled in script.js. New news items are given an id, a title and the content of the article itself and are then inserted into the corresponding pages one after the other. I cheat a little with the date of the articles: getDate(int) returns a date that is the specified number of days in the past. As a result, the news in my project still look as if they were brand new and published just a few days ago, even a year from now.

store.js was the most complex part of the entire project and is responsible for all functions on the potion shop page.

We start with the shopping cart. By clicking on one of the ingredients in the middle, this ingredient is added to the shopping cart on the right-hand side. However, there are a few rules to follow. There are four basic ingredients, of which each potion must contain exactly one. If you add a second one, it will replace the first one. For a better overview, it is also ensured that base ingredients are always listed at the top of the shopping cart. If another ingredient is selected without a base ingredient being present, a message appears indicating that a base ingredient must be selected first. Another message appears if a click would result in the ingredient limit of 6 being exceeded.

By clicking on an ingredient in the shopping cart, it can simply be removed again.

checkForBase() checks whether a base ingredient is available, warns if it is not, and displays the price and the option to checkout if this requirement is met.

calculatePrice() goes through the list of ingredients in the shopping cart and queries the price from the database for each of them. It also checks whether the ingredients are subject to additional fees, for example because they are toxic or of questionable origin. I had to deal with a bug here for a while that removed the fees and the price of toxic ingredients, for example, if you filtered out toxic ingredients. This was ultimately due to the fact that I had not retrieved the information about the ingredients from the database, but from the listing on the website, and in this listing the corresponding filtered-out ingredients were missing, which is why their price dropped to 0. Switching to database queries solved this bug.

Another difficulty was that this was my first contact with asynchronous queries. It took a while, but in the end I escaped a downfall into callback hell and was able to save myself with a courageous "wait" at the right place.

The rest of the shopping cart part regulates the appearance of notification messages and resetting the store after a completed purchase.

The second part of store.js deals with the function of the filters on the left-hand side of the store. When one of the checkboxes is activated or deactivated, a list of all activated filters is updated and then sent to app.py, where a corresponding database query is generated from these filters. The list of ingredients is then recompiled accordingly.

The two poison filters are special: one hides all poisons, the other only shows poisons. I therefore had to include logic to ensure that activating one filter deactivates the other.

Last but not least, I also had to add that activating/deactivating the filters also happens simultaneously with the hidden collapsible filters, and vice versa. In this way, the filter settings remain the same even if the browser window is reduced to such an extent that you have to switch to the collapsible filters instead.

## Concluding remarks
I have learned a lot in the course of this project.
- I have worked a little with Bootstrap.
    - I have also learned to watch out for what else changes when you switch out one version of a framework for another.
- I switched from the cs50 version to the "real" Visual Studio towards the end of the project and started quite liking it.
- Inserting asynchronous elements was a completely new experience for me.
- Dealing with responsive design was a bit of a struggle at first, but it got better and better.
- Unfortunately, hosting dynamic websites is not as simple and free as hosting static websites. So the plan to put the whole thing on GitHub Pages fell through.

And as befits an IT project, this one also took almost twice as long as originally planned (6 weeks instead of 3-4). Partly because of the long break over Christmas and the end of the year, but also because of various unforeseen bugs and other difficulties that simply weren't on the agenda when the project was launched.
