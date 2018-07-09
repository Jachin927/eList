//自适应移动端
document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
$(window).on('resize' , function(){
	document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
});

var xt_songlist=new Array(),$module_ul_li=$('#module_ul').children('li');
var $audio=$('#audio')[0];var sel_list,sel_num=0;
$(function(){
	fetch_song();//进入页面获取localStoragec储存值;
	//menu_jquery
	$('.menu ul li').on('click', function() {//menu点击事件
		var bg_num=$(this).index();
		$('.menu_underline').animate({left:$('.menu_underline').width()*bg_num+"px"},'fast')
		$(this).css('color','#f79e46').siblings().css('color','#b3b3b9');
		$module_ul_li.eq(bg_num).fadeIn('fast').siblings().fadeOut('fast');
		if (bg_num==0) {fetch_song()}
	});
	$(window).on('scroll',function(){clearTimeout(t1);});
	$('.menu').on('click',function(){clearTimeout(t1);});
	$('#module_ul').on('click',function(){clearTimeout(t1);});
	$('.footer').on('click',function(){clearTimeout(t1);});
})
//localStorage清除事件
var t1;
$('.header h1').on('click',function(){
	clearTimeout(t1);
	t1=setTimeout(function(){
		var del_mylike=confirm("确定清空列表'我喜欢听？'");
		if (del_mylike==true) {
		localStorage.removeItem('xt_songlist');
		xt_songlist=[];
		alert('清除成功！');
		$('.menu ul li').eq(0).trigger('click');
		}
	},10000);
});
/*-------------module_a------------------------*/
	function fetch_song(){//读取音乐
		if (localStorage.hasOwnProperty('xt_songlist')) {
			var $module_a_ul=$('.module_a_ul');
			$module_a_ul.empty();
			xt_songlist=fetch('xt_songlist');
			for (var i = 0; i < xt_songlist.length; i++) {
				$('.module_a_ul').append("<li mid="+xt_songlist[i].mid+" num="+i+"><h6>"+xt_songlist[i].songName+"</h6><p>"+xt_songlist[i].song_message+"</p><i class='iconfont icon-del'></i></li>");
			}
		}else{
			$('.module_a_ul').empty();
			$('.module_a_ul').append('<span>暂无喜爱歌曲<br>请搜索或添加</span>');
		}
	}

	$('.module_a_ul').on('click','li',function(){//我喜欢听列表播放事件
		var song_url="http://ws.stream.qqmusic.qq.com/C100"+$(this).attr('mid')+".m4a?fromtag=0&guid=12654844";
		sel_list=1;//用于自动切换歌曲对象
		sel_num=$(this).index();
		$(this).addClass('playing').siblings().removeClass('playing');
		$('#audio').attr({src:song_url,autoplay:"autoplay"});
		$('#play_btn').removeClass('icon-start').addClass('icon-stop');
		change_audio_text($(this).find('h6').text(),$(this).find('p').text());
	});

	$('.module_a_ul').on('click','li i',function(event){//我喜欢听列表删除事件
		event.stopPropagation();
		var del_state=confirm("将该歌曲移出列表？")
		if (del_state==true) {
			var del_index=$(this).parent().attr('num');
			var $module_ul_li=$('.module_a_ul li');
			$(this).parent().remove();
			xt_songlist=[];
			for (var i = 0; i < $('.module_a_ul li').length; i++) {
				xt_songlist.push({mid:$('.module_a_ul li').eq(i).attr('mid'),songName:$('.module_a_ul li').eq(i).children('h6').text(),song_message:$('.module_a_ul li').eq(i).children('p').text()});
			}
			save('xt_songlist',xt_songlist);
			alert('移除成功！')

		}
	})



/*-------------module_a------------------------*/

/*-------------module_b------------------------*/

$('#search_input').on('keyup',function(e){//键盘事件
	if(e.which==13){
		$('#input_btn').trigger('click')
	}
})

$('#input_btn').on('click',function(){//搜索事件
	if ($('#search_input').val()==""||$('#search_input').val()==null) {
		alert('搜索内容不能为空！');
	}else{
		var page=1;
		var search_val=$('#search_input').val();
		var search_url="https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp?w="+search_val+"&n=30&p="+page;
		$.ajax({
			url:search_url,
			dataType:'jsonp',
			jsonpCallback:'callback',
			success:function(data){
				var data=data.data;
				var $search_content=$('#search_content');
				var singer;
				for (var i = 0; i < 10; i++) {
					singer="";
					for (var j = 0; j < data.song.list[i].singer.length; j++) {
						singer+=" "+data.song.list[i].singer[j].name;
					};
					$search_content.append("<li mid="+data.song.list[i].songmid+"><div><h6>"+data.song.list[i].songname+"</h6><p>"+singer+"-"+data.song.list[i].albumname+"</p></div><i class='iconfont icon-like'></i></li>")
				}
			}

		});
		$('#search_input').val("");
	}
})

$('#search_content').on('click','li',function(){//搜索列表播放事件
	var song_url="http://ws.stream.qqmusic.qq.com/C100"+$(this).attr('mid')+".m4a?fromtag=0&guid=12654844";
	// "http://ws.stream.qqmusic.qq.com/C100"+$(this).attr('mid')+".m4a?fromtag=0&guid=12654844";
	sel_list=2;//用于自动切换歌曲对象
	sel_num=$(this).index();
	$(this).addClass('playing').siblings().removeClass('playing');
	$('#audio').attr({src:song_url,autoplay:"autoplay"});
	$('#play_btn').removeClass('icon-start').addClass('icon-stop');
	change_audio_text($(this).find('h6').text(),$(this).find('p').text());
});

$('#search_content').on('click','li i',function(event){//添加到我喜欢听
	event.stopPropagation();
	xt_songlist.push({mid:$(this).parent().attr('mid'),songName:$(this).parent().find('h6').text(),song_message:$(this).parent().find('p').text()});
	save('xt_songlist',xt_songlist);
	alert('添加成功！')
})

/*-------------module_b------------------------*/
/*-------------footer------------------------*/
$('#play_btn').on('click',function(){//播放暂停键切换事件
	if ($(this).hasClass('icon-start')) {
		$(this).removeClass('icon-start').addClass('icon-stop');
		$audio.play();
	}else{
		$(this).removeClass('icon-stop').addClass('icon-start');
		$audio.pause();
	}
});

function change_audio_text(songname,singer){//播放器文本变化
	$('.li_text h6').text(songname);
	$('.li_text p').text(singer);
}
$audio.addEventListener('ended',function(){//歌曲播放完后事件
	if (sel_list==1) {
		sel_num>=$('#search_content li').length-1?sel_num=0:sel_num++;
		$('.module_a_ul li').eq(sel_num).trigger('click');
	}else{
		sel_num>=$('#search_content li').length-1?sel_num=0:sel_num++;
		$('#search_content li').eq(sel_num).trigger('click');
	}
});

$('#next_btn').on('click',function(){//下一首按钮点击事件
	$('.playing').next().trigger('click');
})

$('#last_btn').on('click',function(){//上一首按钮点击事件
	$('.playing').prev().trigger('click');
})
/*-------------footer------------------------*/

//localStorage存储获取函数
function save(key,val){//localStorage保存
    localStorage.setItem(key,JSON.stringify(val));
}
function fetch(key){//localStorage读取
    return JSON.parse(localStorage.getItem(key)) || [] ;
}