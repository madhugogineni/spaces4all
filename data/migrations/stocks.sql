CREATE TABLE `stocks` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(30) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `stocks`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `stocks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

CREATE TABLE `stock_data` (
  `id` int(11) NOT NULL,
  `cur_date` datetime DEFAULT NULL,
  `stock_id` int(11) NOT NULL,
  `total_volume` varchar(10) DEFAULT NULL,
  `delivery_volume` varchar(10) DEFAULT NULL,
  `day_high` varchar(10) DEFAULT NULL,
  `day_low` varchar(10) DEFAULT NULL,
  `open_price` varchar(10) DEFAULT NULL,
  `closing_price` varchar(10) DEFAULT NULL,
  `week_high_52` varchar(10) DEFAULT NULL,
  `week_low_52` varchar(10) DEFAULT NULL,
  `market_cap` varchar(10) DEFAULT NULL,
  `lower_circuit` varchar(10) DEFAULT NULL,
  `upper_circuit` varchar(10) DEFAULT NULL,
  `prev_close` varchar(10) DEFAULT NULL,
  `price_change` varchar(10) DEFAULT NULL,
  `pe_ratio` varchar(10) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `stock_data`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `stock_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;