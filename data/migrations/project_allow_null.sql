ALTER TABLE `projects` CHANGE `no_of_buildings` `no_of_buildings` VARCHAR(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL, CHANGE `no_of_floors` `no_of_floors` VARCHAR(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL, CHANGE `floor_rise` `floor_rise` VARCHAR(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;