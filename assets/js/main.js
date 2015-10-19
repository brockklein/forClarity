/*====================================================
  TABLE OF CONTENT
  1. function declearetion
  2. Initialization
====================================================*/

/*===========================
 1. function declearetion
 ==========================*/
var themeApp = {
	featuredMedia: function(){
		$(".post-wrap").each(function() {
			var thiseliment = $(this);
			var media_wrapper = $(this).find('featured');
			var media_content_embeded = media_wrapper.find('iframe');
			if (media_content_embeded.length > 0) {
				$(media_content_embeded).prependTo(thiseliment).wrap("<div class='featured-media media-embeded'></div>");
				thiseliment.find('.post-content').removeClass('no-media');
			}
		});
	},
	responsiveIframe: function() {
		$('.post-wrap').fitVids();
		function embed() {
			
			if ($(window).width() > 767){
				$('.post-wrap').each(function(){
			        var $this = $(this);
			        var iframe = $(this).find('iframe');
			        if (iframe.length > 0) {
			        	$this.find('.featured-media').css('padding-top', 0);
			            var h1 = $this.find('.featured-media').height();
			            var h2 = iframe.height();
			            var h3 = h1-h2;
			            $this.find('.featured-media').css('padding-top', h3/2);
			        }
			    });
			} else {
				$('.post-wrap').each(function() {
					$(this).find('.featured-media').css('padding-top', 0);
				});
			}
		}
		embed();
	},
	highlighter: function() {
		$('pre code').each(function(i, block) {
		    hljs.highlightBlock(block);
		});
	},
	PreventClick: function() {
		$('.share-text').on('click', function(e){
			e.preventDefault();
		})
	},
	tagcloud:function(){
		var FEED_URL = "/rss/";
		var primary_array = [];
		$.get(FEED_URL, function (data) {
			$(data).find("category").each(function () {
				var el = $(this).text();
				if ($.inArray(el, primary_array) == -1) {
					primary_array.push(el);
				}
			});
			var formated_tag_list = "";
			for ( var i = 0; i < primary_array.length; i = i + 1 ) {
				var tag = primary_array[ i ];
				var tagLink = tag.toLowerCase().replace(/ /g, '-');
				formated_tag_list += ("<a href=\"/tag/" + tagLink + "\">" + tag + "</a>");
			}
			$('.tag-cloud').append(formated_tag_list);
		});
	},
	recentPost:function() {
		var feed_url = "/rss/";
		var code = String('');
		$.get(feed_url, function(data) {
			$(data).find('item').slice(0,recent_post_count).each(function(){
				var link = $(this).find('link').text();
				var title = $(this).find('title').text();
				var published_date = $(this).find('pubDate').text();
				function format_date (dt) {
					var d = new Date(dt);
					var month_name = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
					var month = month_name[d.getMonth()];
					var date = d.getDate();
					var year = d.getFullYear();
					var formatted_dt = month+' '+date+','+' '+year;
					return formatted_dt;
				}
				code += '<div class="recent-single-post">';
				code += '<a href="' + link + '" class="post-title">' + title + '</a><div class="date">' + format_date(published_date) + '</div>';
				code += '</div>';
			})
			$(".recent-post").html(code);
		});
	},
	mailchimp:function() {
		function IsEmail(email) {
			var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			return regex.test(email);
		}
		var form = $('#mc-embedded-subscribe-form');
		form.attr("action", mailchimp_form_url);
		var message = $('#message');
		var submit_button = $('mc-embedded-subscribe');
		form.submit(function(e){
			e.preventDefault();
			$('#mc-embedded-subscribe').attr('disabled','disabled');
			if($('#mce-EMAIL').val() != '' && IsEmail($('#mce-EMAIL').val())) {
				message.html('please wait...').fadeIn(1000);
				var url=form.attr('action');
				if(url=='' || url=='YOUR_MAILCHIMP_WEB_FORM_URL_HERE') {
					alert('Please config your mailchimp form url for this widget');
					return false;
				}
				else{
					url=url.replace('?u=', '/post-json?u=').concat('&c=?');
					console.log(url);
					var data = {};
					var dataArray = form.serializeArray();
					$.each(dataArray, function (index, item) {
					data[item.name] = item.value;
					});
					$.ajax({
						url: url,
						type: "POST",
						data: data,
						dataType: 'json',
						success: function(response, text){
							if (response.result === 'success') {
								message.html(success_message).delay(10000).fadeOut(500);
								$('#mc-embedded-subscribe').removeAttr('disabled');
								$('#mce-EMAIL').val('');
							}
							else{
								message.html(response.result+ ": " + response.msg).delay(10000).fadeOut(500);
								console.log(response);
								$('#mc-embedded-subscribe').removeAttr('disabled');
								$('#mce-EMAIL').focus().select();
							}
						},
						dataType: 'jsonp',
						error: function (response, text) {
							console.log('mailchimp ajax submit error: ' + text);
							$('#mc-embedded-subscribe').removeAttr('disabled');
							$('#mce-EMAIL').focus().select();
						}
					});
					return false;
				}
			}
			else {
				message.html('Please provide valid email').fadeIn(1000);
				$('#mc-embedded-subscribe').removeAttr('disabled');
				$('#mce-EMAIL').focus().select();
			}            
		});
	},
	facebook:function() {
		if ($('.fb').length) {
			var facebook_sdk_script = '<div id="fb-root"></div><script>(function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s); js.id = id;js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.4";fjs.parentNode.insertBefore(js, fjs);}(document, \'script\', \'facebook-jssdk\'));</script>'
			var fb_page = '<div class="fb-page" data-href="'+facebook_page_url+'" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true" data-show-posts="false"><div class="fb-xfbml-parse-ignore"></div></div>';
			$('body').append(facebook_sdk_script);
			$('.fb').append(fb_page);
			$(".fb").fitVids();
		}
	},
	twitter: function() {
		if ($('.twitter').length) {
			var twitter_block = '<a class="twitter-timeline" href="'+twitter_url+'" data-widget-id="'+twitter_widget_id+'" data-link-color="#0062CC" data-chrome="nofooter noscrollbar" data-tweet-limit="'+number_of_tweet+'">Tweets</a>';
			twitter_block += "<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+\"://platform.twitter.com/widgets.js\";fjs.parentNode.insertBefore(js,fjs);}}(document,\"script\",\"twitter-wjs\");</script>";
			$('.twitter').append(twitter_block);
		}
	},
	flickr:function() {
		if ($('.flickr-images').length) {
			$('.flickr-images').jflickrfeed({
				limit: 8,
				qstrings: {
					id: flickr_id
				},
				itemTemplate: 
				'<li>' +
					'<a href="{{link}}" title="{{title}}" target="_blank"><img src="{{image_s}}" alt="{{title}}" /></a>' +
				'</li>'
			});
		}
	},
	init:function(){
		themeApp.featuredMedia();
		themeApp.responsiveIframe();
		themeApp.highlighter();
		themeApp.PreventClick();
		themeApp.tagcloud();
		themeApp.recentPost();
		themeApp.mailchimp();
		themeApp.facebook();
		themeApp.twitter();
		themeApp.flickr();
	}
}
/*===========================
2. Initialization
==========================*/
$(document).ready(function(){
	themeApp.init();
	$(window).resize(function(){
		themeApp.responsiveIframe();
	});
});