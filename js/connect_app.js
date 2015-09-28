//一个联系人应用,有联系人名称、联系方式、地址等信息。
//支持对联系人数据的CRUD操作。

//数据json
var dataJSON=[
	{
		name:"Xiong",
		phone:"13345212635",
		age:21,
		job:"FrontEnd"
	},
	{
		name:"Jianqiao",
		phone:"15871557893",
		age:25,
		job:"BackEnd"
	},
	{
		name:"Xiong",
		phone:"13345212635",
		age:21,
		job:"FrontEnd"
	},
	{
		name:"Jianqiao",
		phone:"15871557893",
		age:25,
		job:"BackEnd"
	}
]

//新建联系人model
var People = Backbone.Model.extend({
	defaults: {
		name:null,
		phone:null,
		age:null,
		job:null,
		isEdit:false
	},
	//联系人基础信息
	getInfo: function() {
		var person = this;
		return {
			name: person.get('name'),
			phone: person.get('phone'),
			age: person.get('age'),
			job: person.get('job'),
			isEdit:person.get('isEdit')
		}
	},
	setInfo:function(json){
		var person=this;
		for(var i in json){
			this.set(i,json[i]);
		}
		return this;
	}
});

//创建联系人集合,将集合传递给了视图的model
var contacts=new Backbone.Collection(dataJSON,{model:People});
// //添加联系人视图
var addView = Backbone.View.extend({
	el: "#addView",
	events: {
		"click #btnDel": "toggleDel",
		"click #addSmt": "addData"
	},
	toggleDel: function() {
		var collects=this.model.models;
		_.each(collects,function(data,idx){
			data.set('isEdit',!data.get('isEdit'));
		});
	},
	addData: function() {
		var v=this;
		var json = {
			name: $("#username").val(),
			phone: $("#tel").val(),
			age: $("#age").val(),
			job: $("#job").val(),
			isEdit:this.model.models[0].get('isEdit')//与其它编辑状态保持一致
		};
		var P=new People(json);
		this.model.unshift(P);
		// console.log(this.model);
		$("#addModal").modal('hide');
	},
	model:contacts
});

//联系人列表视图
var listView = Backbone.View.extend({
	el: "#listView",
	initialize: function() {
		var v=this;
		this.render();
		this.$el.delegate('.delete','click',v.del);
		this.$el.delegate('.edit','click',v.edit);
	},
	render: function() {
		var data = this.model.toJSON();
		var str = "";
		_.each(data,function(d,i){
			str+='<li class="list-group-item clearfix">'
				+'<span class="delete glyphicon glyphicon-remove pull-right hidden"></span>'
				+'<h4>姓名:'+d.name+'<small>年龄:'+d.age+'</small></h4>'
				+'<p>电话:'+d.phone+'</p>'
				+'<p>工作:'+d.job+'</p>'
				+'<span class="edit glyphicon glyphicon-edit pull-right hidden"></span>'
				+'<input type="hidden" value="'+i+'"/>'
				+'</li>';
		});
		this.$el.find("#listWrap").html(str);
		if(this.model.models[0] && this.model.models[0].get('isEdit')){
			this.toggleEdit();
		}
	},
	//切换编辑状态
	toggleEdit: function() {
		var oWrap = this.$el.find("#listWrap");
		if (this.model.models[0].get('isEdit')) {
			oWrap.find('.delete, .edit').removeClass('hidden');
		} else {
			oWrap.find('.delete, .edit').addClass('hidden');
		}
	},
	del:function(){
		var flag=$(this).siblings('input').val();
		var obj=v_list.model.toJSON()[flag];
		$("#deleteName").text("删除联系人:"+obj.name);
		$("#deleteModal").data('deleteId',flag).modal('show');
	},
	edit:function(){
		var flag=$(this).siblings('input').val();
		$("#editModal").data('editId',flag).modal('show');
		v_edit.render();
	},
	model:contacts
});

//删除警告框视图
var alertView=Backbone.View.extend({
	el:$("#deleteModal"),
	events:{
		"click #deleteBtn":"deleteItem",
		"click #cancelBtn":"cancelDel"
	},
	deleteItem:function(){
		var delId=this.$el.data('deleteId');
		var delModel=this.model.models[delId];
		this.model.remove(delModel);
		this.$el.modal('hide');
	},
	cancelDel:function(){
		this.$el.modal('hide');
	},
	model:contacts
});

//编辑框视图
var editView=Backbone.View.extend({
	el:"#editModal",
	events:{
		"click #e_smt":"smt"
	},
	smt:function(){

		this.$el.modal('hide');

		var v=this;
		var flag=v.$el.data('editId');
		var json={
			name:v.$el.find('#e_user').val(),
			age:v.$el.find('#e_age').val(),
			phone:v.$el.find('#e_phone').val(),
			job:v.$el.find('#e_job').val()
		}
		var m=this.model.models[flag];
		_.each(json,function(v,k){
			m.set(k,v);
		});
		v_list.render();
	},
	render:function(){
		var flag=this.$el.data('editId');
		var item=this.model.models[flag].toJSON();

		this.$el.find('#e_user').val(item.name);
		this.$el.find('#e_age').val(item.age);
		this.$el.find('#e_phone').val(item.phone);
		this.$el.find('#e_job').val(item.job);

	},
	model:contacts
});

var v_add =  new addView();
var v_list = new listView();
var v_alert= new alertView();
var v_edit=  new editView();

//监听数据变化
v_list.model.on('change:isEdit', function() {
	v_list.toggleEdit();
});
v_list.model.on('add remove', function() {
	v_list.render();
});