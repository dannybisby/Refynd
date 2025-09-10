import {createRouter, createWebHistory} from "vue-router";

import AccountLogin from "./views/Account/AccountLogin.vue";
import Dashboard from "./views/Dashboard.vue";
import Inventory from "./views/Inventory/Inventory.vue";
import InventoryItemDetail from "./views/Inventory/InventoryItemDetail.vue";
import InventoryItemForm from "./views/Inventory/InventoryItemForm.vue";

const routes = [
	{path: "/", component: Dashboard},
	{path: "/dashboard", component: Dashboard},
	{path: "/buy", component: Dashboard}, // placeholder
	{path: "/sell", component: Dashboard}, // placeholder
	{path: "/inventory", component: Inventory},
	{path: "/inventory/products", component: Inventory},
	{path: "/inventory/categories", component: Inventory}, // placeholder
	{path: "/inventory/suppliers", component: Inventory}, // placeholder
	{path: "/inventory/item/new", component: InventoryItemForm},
	{path: "/inventory/item/:id", component: InventoryItemDetail},
	{path: "/inventory/item/:id/edit", component: InventoryItemForm},
	{path: "/analytics", component: Dashboard}, // placeholder
	{path: "/login", component: AccountLogin},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
