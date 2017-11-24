<?php
/**
 * Created by PhpStorm.
 * User: createc
 * Date: 2017/10/18
 * Time: 下午3:01
 */

header("Content-Type: text/html;charset=utf-8");
$host = 'localhost';//数据库ip
$user = 'niveacrm';//数据库user
$pwd = 'CB4Qn!VAJx1z';//数据库密码
$dbname = 'niveacrm';//数据库名称
$port = '3306';//端口
$link = mysqli_connect($host,$user,$pwd,$dbname,$port);
mysql_query("SET NAMES utf8");
$sex = $_POST['sex'];
$age = $_POST['age'];

if(isset($sex)){
    $res = mysqli_query($link,"insert into pfcs_user (sex,age) values('{$sex}','{$age}');");//存入数据库
}