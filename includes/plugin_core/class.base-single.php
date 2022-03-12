<?php 
/** 
  * Copyright: dtbaker 2012
  * Licence: Please check CodeCanyon.net for licence details. 
  * More licence clarification available here:  http://codecanyon.net/wiki/support/legal-terms/licensing-terms/ 
  * Deploy: 11802 7369f9a61c2e79f820350e955c52cf4b
  * Envato: 31249ba5-dbc2-4eab-bc75-b0df6eb45c51
  * Package Date: 2016-12-01 15:01:26 
  * IP Address: 219.75.80.95
  */


class UCMBaseSingle implements ArrayAccess{


	public $id = 0;
	public $db_id = 'id';
	public $db_table = 'table';
	public $display_key = 'name';
	public $display_name = 'Widget';
	public $display_name_plural = 'Widgets';
	public $db_fields = array();
	public $db_fields_all = array();
	public $db_details = array();


	public function __construct($id = false){

		if(empty($this->db_fields_all)){
			$this->db_fields_all = get_fields($this->db_table);
		}
		if(empty($this->db_fields)){
			$this->db_fields = $this->db_fields_all;
		}
		$this->default_values();
		if($id){
			$this->load($id);
		}
	}

	/*private static $instance;
	static function singleton() {
		if(!isset(self::$instance))
			self::$instance = new self();
		return self::$instance;
	}*/

	public function default_values(){
		if(!empty($_REQUEST['customer_id'])){
			$this->db_details['customer_id'] = (int)$_REQUEST['customer_id'];
		}
	}

	/**
	 * @var UCMDatabase
	 */
	public $db;

	/**
	 * @return UCMDatabase
	 */
	public function get_db(){

		if(!$this->db){
			$this->db = class_exists('UCMDatabase') ? UCMDatabase::singleton() : false;
		}
		$this->db->reset();
		return $this->db;
	}


	public function load($id = false){
		$this->id = 0;
		$this->db_details = array();
		$conn = $this->get_db();
		$id = (int)$id;
		if($id && $conn){
			$this->db->prepare('SELECT * FROM `' . _DB_PREFIX . $this->db_table . '` WHERE `' . $this->db_id . '` = :id');
			// Bind the Id
			$this->db->bind_param('id', $id);
			if($this->db->execute()) {
				// Save returned row
				$temp_details = $this->db->single();
				if( $this->check_permissions( $id, $temp_details ) ) {
					$this->db_details = $temp_details;
					$this->id         = $this->db_details[ $this->db_id ];
				}
			}
		}
		return $this->id;
	}

	public function check_permissions( $id = false, $db_details = false){

		return true;
	}

	public function get($field){
		return $this->db_details[$field];
	}

	public function link_open( $full = false ){
		if($this->id) {
			$link_options = array(
				'full' => $full,
				'type' => $this->db_table,
				'module' => $this->db_table,
				'page' => $this->db_table . '_admin',
				'arguments' => array(
					$this->db_id => $this->id
				),
				'data' => $this->db_details,
				'text' => $this->db_details[ $this->display_key ]
			);
		}else{
			$link_options = array(
				'full' => $full,
				'type' => $this->db_table,
				'module' => $this->db_table,
				'page' => $this->db_table . '_admin',
				'arguments' => array(
					$this->db_id => 'new'
				),
				'data' => array(),
				'text' => $this->display_name
			);
		}
		return link_generate(array($link_options));
	}

	public function delete_with_confirm( $confirm_message = false, $redirect_link = false, $success_callback = false ){
		if($this->id ) {
			if ( ! $confirm_message ) {
				$confirm_message = _l( 'Really Delete ' . $this->display_name, $this->db_details[ $this->display_key ] );
			}
			if(!$redirect_link){
				$redirect_link = $this->link_open();
			}
			if ( module_form::confirm_delete( $this->db_id, $confirm_message, $redirect_link ) ) {
				$this->delete();
				if( $success_callback instanceof Closure ){
					$success_callback( $this );
				}
				set_message( $this->display_name . ' Deleted Successfully' );
				redirect_browser( $redirect_link );
			}
		}
	}

	public function save_data($post_data){
		$conn = $this->get_db();
		if($conn){

			if($this->id){
				$sql = 'UPDATE `' . _DB_PREFIX . $this->db_table . '` SET ';
			}else{
				$sql = 'INSERT INTO `' . _DB_PREFIX . $this->db_table . '` SET ';
			}
			foreach( $this->db_fields as $db_field => $db_field_settings){
				if( isset($post_data[$db_field]) ) {
					if ( is_array( $post_data[ $db_field ] ) ) {
						$post_data[ $db_field ] = serialize( $post_data[ $db_field ] );
					}
					if ( strlen( $post_data[ $db_field ] ) ) {
						$sql .= '`' . $db_field . '` = :' . $db_field . ' , ';
						$this->db->bind_param( $db_field, $post_data[ $db_field ] );
					}
				}
			}
			if($this->id) {
				if ( isset( $this->db_fields_all['date_updated'] ) ) {
					$sql .= " `date_updated` = :date_updated, ";
					$this->db->bind_param( 'date_updated', date('Y-m-d H:i:s') );
				}
				if ( isset( $this->db_fields_all['update_user_id'] ) ) {
					$sql .= " `update_user_id` = :update_user_id, ";
					$this->db->bind_param( 'update_user_id', module_security::get_loggedin_id() );
				}
				$sql = rtrim($sql,', ');
				$sql .= ' WHERE `' . $this->db_id . '` = :id LIMIT 1';
				$this->db->bind_param( 'id', $this->id );
			} else {
				if ( isset( $this->db_fields_all['date_created'] ) ) {
					$sql .= " `date_created` = :date_created, ";
					$this->db->bind_param( 'date_created', date('Y-m-d H:i:s') );
				}
				if ( isset( $this->db_fields_all['create_user_id'] ) ) {
					$sql .= " `create_user_id` = :create_user_id, ";
					$this->db->bind_param( 'create_user_id', module_security::get_loggedin_id() );
				}
				$sql = rtrim($sql,', ');
			}
			$this->db->prepare( $sql );

			if($this->db->execute()){
				if(!$this->id){
					$this->id = $this->db->insert_id();
					$this->db->close();
					$this->load($this->id);
				}else{
					$this->db->close();
				}

				if( $this->id ){
					// we have to save gruops and extra fields and anything else.
					if(class_exists('module_extra')){
						module_extra::save_extras($this->db_table, $this->db_id, $this->id);
					}
					if(class_exists('module_group')){
						module_group::save_groups($this->db_table, $this->db_id, $this->id);
					}
				}

				return $this->id;
			}
		}
		return false;
	}

	public function update($field,$value){
		$conn = $this->get_db();
		if($conn && $this->id && isset($this->db_fields[$field])){

			$this->db->prepare('UPDATE `' . _DB_PREFIX . $this->db_table . '` SET `' . $field . '` = :value WHERE `' . $this->db_id . '` = :id LIMIT 1');

			if(is_array($value)){
				$this->db->bind_param('value', serialize($value) );
			}else{
				$this->db->bind_param('value', $value);
			}

			$this->db->bind_param('id', $this->id);
			if($this->db->execute()){
				$this->db_details[$field] = $value;
			}
			$this->db->close();
		}
	}

	public function delete(){
		$conn = $this->get_db();
		if($conn && $this->id){

			hook_handle_callback('deleting_' . $this->db_table, $this->id);

			$this->db->prepare('DELETE FROM `' . _DB_PREFIX . $this->db_table . '` WHERE `' . $this->db_id . '` = :id LIMIT 1');

			$this->db->bind_param('id', $this->id, 'int');

			if($this->db->execute()){

				$this->delete_children();
				return true;
			}
		}
		return false;
	}

	public function delete_children(){

	}

	public function create_new($data){
		$conn = $this->get_db();
		if($conn){

			$this->db_details;
			$fields = array();
			foreach($data as $field => $value) {
				if ( isset( $this->db_fields[ $field ] ) ) {
					$this->db_details[ $field ] = $value;
				}
			}
			foreach($this->db_details as $field => $value) {
				if ( isset( $this->db_fields[ $field ] ) ) {
					$fields[] = ' `' . $field . '` = :' . $field;
					$this->db->bind_param( $field, $value );
				}
			}

			$this->db->prepare('INSERT INTO `' . _DB_PREFIX . $this->db_table . '` SET '.implode(', ',$fields).'');

			if($this->db->execute()){
				$insert_id = $this->db->insert_id();
				$this->load($insert_id);
				return $insert_id;
			}
		}
		return false;
	}



	public function &__get ($key) {
		return $this->db_details[$key];
	}
	public function __set($key,$value) {
		$this->db_details[$key] = $value;
	}
	public function __isset ($key) {
		return isset($this->db_details[$key]);
	}
	public function __unset($key) {
		unset($this->db_details[$key]);
	}
	public function offsetSet($offset, $value) {
	}

	public function offsetExists($offset) {
		return isset($this->db_details[$offset]);
	}

	public function offsetUnset($offset) {
		unset($this->db_details[$offset]);
	}

	public function offsetGet($offset) {
		return isset($this->db_details[$offset]) ? $this->db_details[$offset] : null;
	}



}