/*
 * @Description: 
 * @version: 1.0
 * @Author: kevin
 * @Date: 2021-09-10 12:14:00
 * @LastEditTime: 2021-09-10 17:56:40
 */
(function (global, factory) {
  // 检查环境
  if (!global.$) throw Error('本插件依赖JQuery.JS,请先引入!');
	// 判断引入方式
	typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() :
	typeof define === "function" && define.amd ? define(factory) : global.Magnifier = factory()	
})(this, function () {
  'use strict';

  function init({ selector, background, markWidth=100, markHight=150,space=20, scale=3, border=unset }) {
    let top = null;
    if (markWidth * scale>=$(selector).height()) {
      top = '-' + ((markWidth * scale - $(selector).height())/2);
    } else {
      top = ($(selector).height()-markWidth * scale )/2;
    }
    $(selector).wrap(`<span class="magnifier_box" style="position: relative;
    cursor: move;">
        <span class="magnifier_marks"
        style="display:none;
        position: absolute;
        z-index: 100000;
        top: 0;
        pointer-events: none;
        left: 0;
        background:${background};
        width: ${markWidth}px;
        height:${markHight}px;">
        </span>
        <span class="magnifier_bigImg_box"
        style="display:none;
        position: absolute;
        overflow: hidden;
        z-index: 100000;
        border:${border};
        background:${background};
        top:${top}px;
        right: -${markWidth * scale + space + 'px'};
        width: ${markWidth * scale}px;
        height:${markHight * scale}px;">
            <div style="position: relative;
            width: 100%;
            height: 100%;">
             <img class="magnifier_bigImg"  style="position: relative;
                top: 0;
                left: 0;
                width: ${$(selector).width()*scale}px;
                height: ${$(selector).height()*scale}px;"  alt="">
            </div>
        </span>
  </span>`);
  };
  // 构造函数
  function Magnifier(params) {
    init(params);
    const { selector, background, markWidth, markHight, scale, border } = params;
    // 显示
    $(selector).mouseenter(function () {
      $(this).siblings('.magnifier_bigImg_box').children('div').children('.magnifier_bigImg').attr('src',$(this).attr('src'));
      $(this).parent('.magnifier_box').children('.magnifier_marks, .magnifier_bigImg_box').fadeIn(300);
    })
    // 隐藏
    $(selector).mouseleave(function () {
      $(this).parent('.magnifier_box').children('.magnifier_marks, .magnifier_bigImg_box').fadeOut(300);
    });
    // 移动
    $(selector).mousemove(function (e) {
      const bigImg = $(this).siblings('.magnifier_bigImg_box').children('div').children('.magnifier_bigImg');
      const mark = $(this).siblings('.magnifier_marks');
      const moveWidth=mark.width()/2;
      const moveHight=mark.height()/2;
      let moveX=e.offsetX - moveWidth;
      let moveY=e.offsetY - moveHight;
      const moveRight= $(this).width()-mark.width();
      const moveTop= $(this).height()-mark.height();
      // 边际判断
      if (moveX < 0) moveX=0;
      if (moveY < 0) moveY=0;
      if (moveX>moveRight) moveX=moveRight;
      if (moveY>moveTop) moveY=moveTop;
      mark.css({
        top: moveY + 'px',
        left: moveX + 'px',
      });
      bigImg.css({
        top:`-${scale*moveY }px`,
        left: `-${scale*moveX }px`,
      });
    });
  }
  return Magnifier;
})