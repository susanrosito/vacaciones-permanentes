var views = module.exports = [];

views.push({
    paths: ["/index.html"],
    file: "index.html"
});
views.push({
    paths: ["/404.html"],
    file: "404"
});
views.not_found = "404";
views.root = "index";