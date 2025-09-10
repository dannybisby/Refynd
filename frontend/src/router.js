import {createRouter, createWebHistory} from "vue-router";

import AccountLogin from "./views/Account/AccountLogin.vue";
import Dashboard from "./views/Dashboard.vue";
import Inventory from "./views/Inventory/Inventory.vue";
import UIComponentsDemo from "./views/UIComponentsDemo.vue";

const routes = [
	{path: "/", component: Dashboard},
	{path: "/dashboard", component: Dashboard},
	{path: "/buy", component: Dashboard}, // placeholder
	{path: "/sell", component: Dashboard}, // placeholder
	{path: "/inventory", component: Inventory}, // placeholder
	{path: "/inventory/products", component: Inventory}, // placeholder
	{path: "/inventory/categories", component: Inventory}, // placeholder
	{path: "/inventory/suppliers", component: Inventory}, // placeholder
	{path: "/analytics", component: Dashboard}, // placeholder
	{path: "/login", component: AccountLogin},
	{path: "/ui-demo", component: UIComponentsDemo},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
