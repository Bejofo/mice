var content = {
	Monsters: {
		rat: new Monster({
			id: 'rat',
			icon: 'r',
			fcolor: '#ffffff'
		})
	},
	Terrain: {
		floor: new Terrain({
			id: 'floor',
			icon: ' ',
			fcolor: '#2d2200',
			breaksLineOfSight: false,
			solid: false
		}),
		wall: new Terrain({
			id: 'wall',
			icon: '#',
			fcolor: '#afafaf',
			breaksLineOfSight: true,
			solid: true
		}),
		odoor: new Terrain({
			id: 'odoor',
			icon: '-',
			fcolor: '#ffffff',
			breaksLineOfSight: false,
			solid: false
		}),
		cdoor: new Terrain({
			id: 'cdoor',
			icon: '+',
			fcolor: '#ffffff',
			breaksLineOfSight: true,
			solid: true
		})
	}
}
