using System;
using System.Collections.Generic;
using System.Linq;

namespace LogiTrack.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string CustomerName { get; set; }
        public DateTime DatePlaced { get; set; }
        public List<InventoryItem> Items { get; set; } = new List<InventoryItem>();

        // For cart/session persistence
        public string? SessionId { get; set; }
        public string? UserToken { get; set; }

        public void AddItem(InventoryItem item)
        {
            Items.Add(item);
        }

        public void RemoveItem(int itemId)
        {
            var item = Items.FirstOrDefault(i => i.ItemId == itemId);
            if (item != null)
            {
                Items.Remove(item);
            }
        }

        public string GetOrderSummary()
        {
            return $"Order #{OrderId} for {CustomerName} | Items: {Items.Count} | Placed: {DatePlaced:d}";
        }
    }

    // Test block
    public static class OrderTest
    {
        public static void Run()
        {
            var order = new Order
            {
                OrderId = 1001,
                CustomerName = "Samir",
                DatePlaced = new DateTime(2025, 4, 5),
            };

            var item1 = new InventoryItem
            {
                ItemId = 1,
                Name = "Widget",
                Quantity = 2,
                Location = "A1",
            };
            var item2 = new InventoryItem
            {
                ItemId = 2,
                Name = "Gadget",
                Quantity = 1,
                Location = "B2",
            };

            order.AddItem(item1);
            order.AddItem(item2);
            order.RemoveItem(1); // Remove Widget

            Console.WriteLine(order.GetOrderSummary());
        }
    }
}
