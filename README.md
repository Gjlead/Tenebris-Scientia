# Tenebris scientia
#### Description:
As my final project for the "Introduction to Computer Science" course that I took at HarvardX at the end of 2023 I created a website for **Tenebris scientia**, a fictional magical university specializing in the dark arts, open to young magical individuals who where cast out for being different. On this website you can find information about the university itself, read news about the fictional world we are situated in, check out this year's winners of the annual poetry competition and - most important! - choose your own mix of ingredients for a potion in the **potion shop**, the centerpiece of this project.

This website project is a wonderful presentation of what I have learned during my time with CS50. In its implementation, I used a wild mixture of HTML, CSS, JavaScript, Bootstrap, Flask, Jinja and SQL, using pretty much everything we came across in the previous assignments apart from C and Scratch.

### Some personal highlights

### 1. The Bootstrap carousel in index.html.

Carousels have been all the rage on various websites for years, so naturally, my university needed one too. Bootstrap offers an uncomplicated way to implement a carousel - only the styling of the control elements can be a bit tricky when working with it for the first time. Basically, such a Bootstrap carousel on my website consists of carousel-items that each contain a blockquote class, in which a quote about the university and the author of the quote can be inserted. A pitfall for me was that I initially worked with Bootstrap version 4 and later switched to version 5 for the collapsibles that I needed for the potion shop, and Bootstrap switched from attribute names such as "data-target" to "data-bs-target", which destroyed all my Bootstrap elements for some time until I understood what had happened.

### 2. The most complex of my HTML files, potionStore.html.

The potion shop is the most important part of my project and brings in the complexity that is necessary to be able to call the whole thing my final project. The page consists of a large container that contains the ingredient filters, the ingredient list and the shopping cart. The ingredient list is filled from a small, specially created database using Jinja. On the left-hand side, various ingredients can be filtered in or out using checkboxes. A click on such a checkbox transmits the information which filters are activated via AJAX fetch request to the Python file, and receives the results of an SQL query adapted to these filters in JSON format, with which the displayed ingredient list is then immediately updated without the need for a page refresh.

The ingredients selected in the center end up in the shopping cart on the right-hand side. At the bottom, the price of the potion is recalculated and displayed with each ingredient added or removed.

### 3. ingredients.db
A small database containing 19 different ingredients for the potion shop. In addition to their unique ID, ingredients have a name, description, effect, price and information on whether they are a base ingredient and whether they are vegan, poisonous, sourced in a dubious way or just taste downright disgusting.

## Concluding remarks
I have learned a lot in the course of this project.
- I have worked a little with Bootstrap.
    - I have also learned to watch out for what else changes when you switch out one version of a framework for another.
- I switched from the CS50 version to the "real" Visual Studio towards the end of the project and started quite liking it.
- Inserting asynchronous elements was a completely new experience for me.
- Dealing with responsive design was a bit of a struggle at first, but it got better and better.
- Unfortunately, hosting dynamic websites is not as simple and free as hosting static websites. So the plan to put the whole thing on GitHub Pages fell through.

And as befits an IT project, this one also took almost twice as long as originally planned (6 weeks instead of 3-4). Partly because of the long break over Christmas and the end of the year, but also because of various unforeseen bugs and other difficulties that simply weren't on the agenda when the project was launched.
