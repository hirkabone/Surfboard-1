const findBlockByAlias = (alias) => {
    return $(".reviews__item").filter((ndx, item) => {
        return $(item).attr("data-linked-with") == alias;
    });
}

$(".interactive__avatar-link").click(e => {
    e.preventDefault();

    const $this = $(e.currentTarget);
    const target = $this.attr("data-open");
    const itemToShow = findBlockByAlias(target);
    const currentItem = $this.closest(".interactive-avatar");

    itemToShow.addClass("visible").siblings().removeClass("visible");
    currentItem.addClass("active").siblings().removeClass("active");
});