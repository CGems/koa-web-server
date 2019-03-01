export function transformFilePathToRoute(routes) {
    return routes.map(route => {
        route = { ...route }
        if (route.component) {
            const path = route.component
            route.component = () => import('Views/' + path)
        }
        if (route.children) {
            route.children = transformFilePathToRoute(route.children)
        }
        return route
    })
}