// Tô dần từng chữ khi cuộn tới câu trích campus và đoạn giới thiệu DAV.
$(".campus .quote span, .dav .scroll > span").each(function () {
  var $box = $(this);
  var words = $box.text().trim().split(/\s+/);
  $box.empty();
  $.each(words, function (_, word) {
    $box.append($("<span/>").text(word));
  });
  var $words = $box.children("span");
  function paint() {
    var vh = $(window).height();
    var top = $box.offset().top;
    var start = top - vh * 0.85;
    var end = top + $box.outerHeight() - vh * 0.45;
    var p = ($(window).scrollTop() - start) / (end - start);
    if (p < 0) p = 0;
    if (p > 1) p = 1;
    var n = Math.round(p * $words.length);
    $words.each(function (i) {
      $(this).toggleClass("on", i < n);
    });
  }
  $(window).on("scroll", paint);
  paint();
});

// Chạy số tăng dần. Chỉ nhận chữ là số, hậu tố nằm ở data-suffix.
$(".counter-up").filter(function () {
  return /^[0-9,]+$/.test($(this).text());
}).counterUp({ delay: 10, time: 1200 });

// Đổi tab Song bằng / Liên kết và tab Alumni.
$(".programs .nav-tabs a, .alumni .nav-tabs a").on("click", function (e) {
  e.preventDefault();
  $(this).tab("show");
});

// Slider đối tác trên trang chủ: đổi tiêu đề, mô tả và số trang theo slide.
var $lead = $(".leaders .owl-carousel");
$lead.owlCarousel({ items: 1, dots: false, nav: false }).on("changed.owl.carousel", function (e) {
  var i = e.item.index;
  var $s = $lead.find(".owl-item").eq(i).children("div");
  var $n = $(".leaders .note .copy span");
  $n.first().text($s.attr("data-title"));
  $n.last().text($s.attr("data-copy"));
  $(".leaders .pager > span").first().html("<em>0" + (i + 1) + "/</em>0" + e.item.count);
});

$(".leaders .pager .prev").on("click", function () {
  $lead.trigger("prev.owl.carousel");
});

$(".leaders .pager .next").on("click", function () {
  $lead.trigger("next.owl.carousel");
});

// Slider thẻ chương trình trong tab Song bằng.
$(".programs .owl-carousel").owlCarousel({
  items: 2,
  margin: 20,
  loop: true,
  dots: true,
  nav: false,
  dotsContainer: ".programs .pager .dots",
  responsive: {
    0: { items: 1 },
    768: { items: 2 }
  }
});

// Kéo ngang dãy ảnh nhỏ trong thẻ chương trình.
$(".course .thumbs").on("mousedown", function (e) {
  e.preventDefault();
  e.stopPropagation();
  var el = this;
  var x = e.pageX;
  var left = el.scrollLeft;
  function move(ev) {
    el.scrollLeft = left - (ev.pageX - x);
  }
  $(document).on("mousemove.thumbs", move).one("mouseup", function () {
    $(document).off("mousemove.thumbs", move);
  });
});

// Nút trước / sau của slider chương trình, không chuyển trang.
$(".programs .pager .prev").on("click", function (e) {
  e.preventDefault();
  $(this).closest(".tab-pane").find(".owl-carousel").trigger("prev.owl.carousel");
});

$(".programs .pager .next").on("click", function (e) {
  e.preventDefault();
  $(this).closest(".tab-pane").find(".owl-carousel").trigger("next.owl.carousel");
});

// Slider hội đồng / ban trên trang chủ.
var $alum = $(".alumni .owl-carousel");
$alum.owlCarousel({
  margin: 24,
  dots: false,
  loop: true,
  nav: false,
  responsive: {
    0: { items: 1 },
    768: { items: 2 },
    992: { items: 3 }
  }
});
$(".alumni .board .prev").on("click", function () {
  $alum.trigger("prev.owl.carousel");
});
$(".alumni .board .next").on("click", function () {
  $alum.trigger("next.owl.carousel");
});

// Slider câu chuyện cựu sinh viên, cập nhật số 01/03.
var $tales = $(".stories .owl-carousel");
if ($tales.length) {
  function talePad(n) {
    return (n < 10 ? "0" : "") + n;
  }
  $tales.owlCarousel({
    items: 1,
    dots: false,
    nav: false,
    smartSpeed: 450
  }).on("changed.owl.carousel", function (e) {
    if (!e.item) return;
    $(".stories .count").text(talePad(e.item.index + 1) + "/" + talePad(e.item.count));
  });
  $(".stories .prev").on("click", function () {
    $tales.trigger("prev.owl.carousel");
  });
  $(".stories .next").on("click", function () {
    $tales.trigger("next.owl.carousel");
  });
}

// Hành trình cựu sinh viên: lọc theo tab, ẩn mũi tên khi thẻ không nhiều hơn số ô đang hiện.
var $story = $(".journey .owl-carousel");
if ($story.length) {
  var storyCards = $story.children(".alum").clone();
  function storyVisible() {
    var w = window.innerWidth;
    if (w >= 992) return 3;
    if (w >= 768) return 2;
    return 1;
  }
  function storyArrows() {
    var n = $story.find(".owl-item").not(".cloned").length;
    $(".journey .board").toggleClass("more", n > storyVisible());
  }
  function storyOwl() {
    $story.owlCarousel({
      margin: 24,
      dots: false,
      nav: false,
      responsive: {
        0: { items: 1 },
        768: { items: 2 },
        992: { items: 3 }
      }
    });
    storyArrows();
  }
  $(window).on("resize", storyArrows);
  function storyShow(kind) {
    if ($story.hasClass("owl-loaded")) {
      $story.trigger("destroy.owl.carousel");
      $story.find(".owl-stage-outer").children().unwrap();
      $story.removeClass("owl-loaded owl-drag");
    }
    $story.empty().addClass("owl-carousel");
    storyCards.each(function () {
      if (kind === "all" || this.getAttribute("data-kind") === kind) $story.append($(this).clone());
    });
    storyOwl();
  }
  storyOwl();
  $(".journey .nav-tabs span").on("click", function () {
    $(this).addClass("active").parent().siblings().children("span").removeClass("active");
    storyShow($(this).attr("data-kind"));
  });
  $(".journey .board .prev").on("click", function (e) {
    e.preventDefault();
    $story.trigger("prev.owl.carousel");
  });
  $(".journey .board .next").on("click", function (e) {
    e.preventDefault();
    $story.trigger("next.owl.carousel");
  });
}
// Đổi màu chữ ô select trong form tư vấn sau khi đã chọn.
$(".ask select").on("change", function () {
  $(this).toggleClass("set", this.value !== "");
});
// Slider tin liên quan ở cuối bài viết.
var $related = $(".meet.related .board");
if ($related.length) {
  $related.owlCarousel({
    margin: 28,
    dots: false,
    nav: false,
    responsive: { 0: { items: 1 }, 768: { items: 2 }, 992: { items: 3 } }
  });
  $(".meet.related .prev").on("click", function () {
    $related.trigger("prev.owl.carousel");
  });
  $(".meet.related .next").on("click", function () {
    $related.trigger("next.owl.carousel");
  });
}
// Slider lời nhận xét trong khối Vì sao, chỉ đổi bằng nút và cập nhật số trang.
var $voice = $(".why .voice .owl-carousel");
if ($voice.length) {
  function voicePad(n) {
    return (n < 10 ? "0" : "") + n;
  }
  $voice.owlCarousel({
    items: 1,
    dots: false,
    nav: false,
    mouseDrag: false,
    touchDrag: false,
    animateOut: "fadeOut",
    animateIn: "fadeIn",
    smartSpeed: 450
  }).on("changed.owl.carousel", function (e) {
    var i = e.relatedTarget.relative(e.item.index);
    $(".why .voice .count").text(voicePad(i + 1) + "/" + voicePad(e.item.count));
  });
  $(".why .voice .count").text(voicePad(1) + "/" + voicePad($voice.find(".owl-item").length));
  $(".why .voice .prev").on("click", function () {
    $voice.trigger("prev.owl.carousel");
  });
  $(".why .voice .next").on("click", function () {
    $voice.trigger("next.owl.carousel");
  });
}
// Thư viện ảnh cơ sở: hai hàng, đếm trang, bấm ảnh mở Fancybox (ảnh hoặc video nếu có data-video).
var $facility = $(".facility .owl-carousel");
if ($facility.length) {
  function facilityPad(n) {
    return (n < 10 ? "0" : "") + n;
  }
  function facilityRows() {
    var h = $facility.find(".owl-item img").first().height();
    if (!h) return;
    $facility.find(".owl-stage").css("height", h * 2 + 4);
  }
  $facility.on("initialized.owl.carousel refreshed.owl.carousel resized.owl.carousel translated.owl.carousel", facilityRows);
  $facility.find("img").on("load", facilityRows);
  $facility.append($facility.children(".shot").clone());
  $facility.owlCarousel({
    margin: 4,
    dots: false,
    nav: false,
    smartSpeed: 450,
    slideBy: 1,
    responsive: { 0: { items: 2 }, 992: { items: 4 } }
  }).on("changed.owl.carousel", function (e) {
    if (!e.item || !e.property || e.property.name !== "position") return;
    var owl = $facility.data("owl.carousel");
    var i = owl.relative(owl.current());
    var max = owl.items().length / 2 - owl.settings.items;
    if (i > max) {
      $facility.trigger("to.owl.carousel", [max, 300, true]);
      i = max;
    }
    if (i < 0) i = 0;
    $(".facility .count").text(facilityPad(i + 1) + "/" + facilityPad(max + 1));
  });
  $(".facility .prev").on("click", function () {
    $facility.trigger("prev.owl.carousel");
  });
  $(".facility .next").on("click", function () {
    $facility.trigger("next.owl.carousel");
  });
  facilityRows();
  $(".facility").on("click", ".shot", function () {
    var src = $(this).find("img").attr("src");
    var video = this.getAttribute("data-video");
    var items = [];
    var start = 0;
    var seen = {};
    var photos = true;
    $facility.find(".owl-item:not(.cloned) .shot").each(function () {
      var file = $(this).find("img").attr("src");
      var clip = this.getAttribute("data-video");
      var key = clip || file;
      if (seen[key]) return;
      seen[key] = 1;
      if (clip) {
        photos = false;
        items.push({ src: clip, thumb: file, thumbSrc: file });
      } else {
        items.push({ src: file, thumbSrc: file });
      }
    });
    if (photos) {
      items.sort(function (a, b) {
        return a.src.localeCompare(b.src, undefined, { numeric: true });
      });
    }
    $.each(items, function (i, item) {
      if ((video || src) === item.src) start = i;
    });
    Fancybox.show(items, { startIndex: start });
  });
}
// Accordion tổng quan: mở một mục hoặc mở / đóng tất cả.
var $overview = $(".overview");
if ($overview.length) {
  function overviewLabel() {
    var all = $overview.find(".item").length === $overview.find(".item.on").length;
    $overview.find(".all").toggleClass("on", all).children("span").text(all ? "Đóng tất cả" : "Mở tất cả");
  }
  function overviewSet($item, open) {
    if ($item.hasClass("on") === open) return;
    $item.toggleClass("on", open);
    $item.children(".body").stop(true, true)[open ? "slideDown" : "slideUp"](280);
  }
  $overview.on("click", ".more", function () {
    var $item = $(this).closest(".item");
    overviewSet($item, !$item.hasClass("on"));
    overviewLabel();
  });
  $overview.on("click", ".all", function () {
    var open = $overview.find(".item").length !== $overview.find(".item.on").length;
    $overview.find(".item").each(function () {
      overviewSet($(this), open);
    });
    overviewLabel();
  });
}

// Menu ngôn ngữ: bấm VIE/UK để mở, chọn mục thì đổi cờ và chữ trên nút, bấm ra ngoài thì đóng.
$(".site-header .lang").on("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  $(this).siblings(".langs").toggleClass("on");
});

$(".site-header .langs").on("click", function (e) {
  e.stopPropagation();
});

$(".site-header .langs").on("click", ".choice", function () {
  var $choice = $(this);
  var code = $.trim($choice.text());
  var src = $choice.find("img").attr("src");
  $choice.addClass("on").siblings().removeClass("on");
  var $lang = $choice.closest("li").children(".lang");
  $lang.children("img").eq(0).attr("src", src);
  $lang.contents().filter(function () {
    return this.nodeType === 3 && $.trim(this.nodeValue);
  })[0].nodeValue = code;
  $choice.parent().removeClass("on");
});

$(document).on("click", function () {
  $(".site-header .langs").removeClass("on");
});

// Accordion câu hỏi thường gặp.
$(".faq").each(function () {
  var $faq = $(this);
  $faq.find(".item.on").children(".body").show();
  $faq.on("click", ".more", function () {
    var $item = $(this).closest(".item");
    var open = !$item.hasClass("on");
    $item.toggleClass("on", open);
    $item.children(".body").stop(true, true)[open ? "slideDown" : "slideUp"](280);
  });
});
