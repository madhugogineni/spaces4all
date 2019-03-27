var con = require("../database");
module.exports = {

    getAdminByEmail: function (emailId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from admin where email='" + emailId + "'", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPropertyType: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from property_type order by property_type_id DESC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },

    getPropertyTypeById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select type from property_type where property_type_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPropertySubType: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from property_sub_type", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPropertySubTypeById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from property_sub_type where property_sub_type_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            })
        });
    },
    getPropertySubTypeByProperty(propertyId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from property_sub_type where property_type_id=" + propertyId, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getProjectType: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_type", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getProjectTypeById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_type where project_type_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            })
        });
    },
    getProjectSubType: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_sub_type", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },

    getProjectSubTypeById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_sub_type where project_sub_type_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },

    getProjectSubTypeByProject: function (projectId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_sub_type where project_type_id=" + projectId, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getBanks: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from banks", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getBankById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from banks where bank_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getAmenities: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from amenities", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getAmenitiesById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from amenities where amenity_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getCity: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from city order by city ASC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getCityLimit: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from city order by city_id ASC limit 1", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getCityById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from city where city_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getLocality: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from locality order by locality ASC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getLocalityById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from locality where locality_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getLocalityByCity: function (cityId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from locality where city_id=" + cityId + " order by locality ASC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },

    getStates: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from state", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getStateById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from state where state_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getListProperty: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from list_property order by datetime DESC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPropertyId: function (name, email, property_type, property_sub_type, city, locality, date) {
        return new Promise(function (resolve, reject) {
            con.query("select list_property_id from list_property where name='" + name + "' and email='" + email + "' and property_type=" + property_type + " and property_sub_type=" + property_sub_type + " and city=" + city + " and locality=" + locality + " and datetime='" + date + "'", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getListPropertyById: function (propertyId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from list_property where list_property_id=" + propertyId, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPlotDetails(propertyId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from residential_plot_details where list_property_id=" + propertyId, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getListPropertyLatest: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from latest_property order by latest_property_id ASC limit 6", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPropertyDetailsById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from latest_property where list_property_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPropertyPhotosLimit: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from property_photos where property_id=" + id + " limit 1", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPropertyPhotos: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from property_photos where property_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPropertyPhotoById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from property_photos where photo_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPostRequirement: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from post_requirement order by datetime DESC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPostRequirementCount: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from post_requirement", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result.length);
            });
        });
    },
    getPostRequirementById(postRequirementId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from post_requirement where post_requirement_id=" + postRequirementId, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result.length);
            });
        });
    },
    getProperties: function (propertyType, propertySubType, city, locality, bedrooms, postedBy, minPrice, maxPrice, possession, ) {
        var query = "SELECT * FROM list_property where list_property_id !=0";


        query += " AND status='1' ORDER BY datetime DESC ";
        console.log(query);
        // if()
    }
    /*

	

    function get_properties(){    	

    	

    	$sql = "SELECT * FROM list_property where list_property_id !=0";

    	 

    	if ($this->input->get('property_type')) {

    		if ($this->input->get('property_type') != '0') {

    			$sql .= " AND property_type='".$this->input->get('property_type')."'";

    		}    		

    	}

    	if ($this->input->get('property_sub_type')) {

    		$sql .= " AND property_sub_type='".$this->input->get('property_sub_type')."'";

    	}

    	if ($this->input->get('city')) {

    		$sql .= " AND city='".$this->input->get('city')."'";

    	}

    	if ($this->input->get('locality')) {

    		$sql .= " AND locality='".$this->input->get('locality')."'";

    	}

    	if ($this->input->get('bedrooms')) {

    		$sql .= " AND bedrooms='".$this->input->get('bedrooms')."'";

    	}

    	if ($this->input->get('posted_by')) {

    		$sql .= " AND posted_by='".$this->input->get('posted_by')."'";

    	}

    	

    	if ($this->input->get('min_price')) {    			

    		$sql .= " AND quoted_price >='".$this->input->get('min_price')."'";    		    		 

    	}    	

    	if ($this->input->get('max_price')) {

    			$sql .= " AND quoted_price <='".$this->input->get('max_price')."'";

    	}

    	

    	if ($this->input->get('possession')) {

    		$sql .= " AND possession ='".$this->input->get('possession')."'";

    	}

    	    	 

    	$sql .= " AND status='1' ORDER BY datetime DESC ";

    	 	    	

    	$query = $this->db->query($sql);

    	return $query->result_array();

    }

    

    function get_properties_count(){

    	 

    	$sql = "SELECT list_property_id FROM list_property where list_property_id!=0";

    

    	if ($this->input->get('property_type')) {

    		if ($this->input->get('property_type') != '0') {

    			$sql .= " AND property_type='".$this->input->get('property_type')."'";

    		}

    	}

    	if ($this->input->get('property_sub_type')) {

    		$sql .= " AND property_sub_type='".$this->input->get('property_sub_type')."'";

    	}

    	if ($this->input->get('city')) {

    		$sql .= " AND city='".$this->input->get('city')."'";

    	}

    	if ($this->input->get('bedrooms')) {

    		$sql .= " AND bedrooms='".$this->input->get('bedrooms')."'";

    	}

    	if ($this->input->get('posted_by')) {

    		$sql .= " AND posted_by='".$this->input->get('posted_by')."'";

    	}

    	if ($this->input->get('min_price')) {    			

    		$sql .= " AND quoted_price >='".$this->input->get('min_price')."'";    		    		 

    	}    	

    	if ($this->input->get('max_price')) {

    			$sql .= " AND quoted_price <='".$this->input->get('max_price')."'";

    	}

    	if ($this->input->get('possession')) {

    		$sql .= " AND possession ='".$this->input->get('possession')."'";

    	}

    	if ($this->input->get('search_type')) {

    		$sql .= " AND want_to ='".$this->input->get('search_type')."'";

    	}

    	

    	$sql .= " AND status='1'";

        	 

    	$query = $this->db->query($sql);

    	return $query->num_rows();

    }

    

    function get_hot_properties($city){

    	     	

    	$sql = "SELECT * FROM list_property where list_property_id !=0 and hot_property='1' and city='".$city."' ORDER BY datetime DESC";

    

       	$query = $this->db->query($sql);

    	return $query->result_array();

    }

    

    function get_similar_properties($list_property_id,$property_type,$city){

             

    	$this->db->like('property_type',$property_type);

    	$this->db->like('city',$city);

    	$this->db->where('list_property_id !=',$list_property_id);

    	$this->db->where('status','1');

    	$this->db->order_by('datetime','desc');

    	$this->db->limit('4');

    	

    	$query = $this->db->get('list_property');

    	return $query->result_array();

    }

    

    function get_similar_projects($project_id,$project_type,$city){

    

        $this->db->like('project_type',$project_type);

    	$this->db->like('city',$city);

    	$this->db->where('project_id !=',$project_id);

    	$this->db->where('project_status','1');    	

    	$this->db->order_by('datetime','desc');

    	$this->db->limit('4');

    	 

    	$query = $this->db->get('projects');

    	return $query->result_array();

    }

    

    function get_similar_rent_properties($rent_id,$property_type,$city){

    

        $this->db->like('property_type',$property_type);

    	$this->db->like('city',$city);

    	$this->db->where('rent_id !=',$rent_id);

    	$this->db->where('status','1');

    	$this->db->order_by('datetime','desc');

    	$this->db->limit('4');

    	 

    	$query = $this->db->get('rent');

    	return $query->result_array();

    }
    */
};