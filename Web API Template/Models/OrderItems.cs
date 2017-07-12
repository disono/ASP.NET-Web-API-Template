using System;

namespace Web_API_with_Oracle.Models
{
	public partial class OrderItems
	{
		public decimal ORDER_ITEM_ID { get; set; }
		public int ORDER_ID { get; set; }
		public int PRODUCT_ID { get; set; }
		public decimal UNIT_PRICE { get; set; }
		public int QUANTITY { get; set; }
		public DateTime DATE_CREATED { get; set; }
	}
}