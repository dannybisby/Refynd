import {createRouter, createWebHistory} from "vue-router";

import AccountLogin from "./views/Account/AccountLogin.vue";
import Dashboard from "./views/Dashboard.vue";
import Inventory from "./views/Inventory/Inventory.vue";
import UIComponentsDemo from "./views/UIComponentsDemo.vue";
import InventoryItemDetail from "./views/Inventory/InventoryItemDetail.vue";
import InventoryItemForm from "./views/Inventory/InventoryItemForm.vue";
import Sell from "./views/Sell/Sell.vue";
import SellMessages from "./views/Sell/SellMessages.vue";
import SellOffers from "./views/Sell/SellOffers.vue";
import SellPerformance from "./views/Sell/SellPerformance.vue";
import SellListingForm from "./views/Sell/SellListingForm.vue";
import SellListingDetail from "./views/Sell/SellListingDetail.vue";
import Shipping from "./views/Shipping/Shipping.vue";
import ShippingDetail from "./views/Shipping/ShippingDetail.vue";
import ShippingForm from "./views/Shipping/ShippingForm.vue";

const routes = [
	{path: "/", component: Dashboard},
	{path: "/dashboard", component: Dashboard},
	{path: "/buy", component: Dashboard}, // placeholder
	{path: "/sell", component: Sell},
	{path: "/sell/listings", component: Sell},
	{path: "/sell/messages", component: SellMessages},
	{path: "/sell/offers", component: SellOffers},
	{path: "/sell/performance", component: SellPerformance},
	{path: "/sell/listing/new", component: SellListingForm},
	{path: "/sell/listing/:id", component: SellListingDetail},
	{path: "/sell/listing/:id/edit", component: SellListingForm},
	{path: "/sell/listing/:id/messages", component: SellMessages},
	{path: "/sell/listing/:id/offers", component: SellOffers},
	{path: "/inventory", component: Inventory},
	{path: "/inventory/products", component: Inventory},
	{path: "/inventory/categories", component: Inventory}, // placeholder
	{path: "/inventory/suppliers", component: Inventory}, // placeholder
	{path: "/inventory/item/new", component: InventoryItemForm},
	{path: "/inventory/item/:id", component: InventoryItemDetail},
	{path: "/inventory/item/:id/edit", component: InventoryItemForm},
	{path: "/shipping", component: Shipping},
	{path: "/shipping/shipment/new", component: ShippingForm},
	{path: "/shipping/shipment/:id", component: ShippingDetail},
	{path: "/shipping/shipment/:id/edit", component: ShippingForm},
	{path: "/analytics", component: Dashboard}, // placeholder
	{path: "/login", component: AccountLogin},
	{path: "/ui-demo", component: UIComponentsDemo},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
