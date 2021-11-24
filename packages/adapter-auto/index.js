import { adapters } from './adapters.js';

/** @type {import('.')} **/
export default function () {
	return {
		name: '@sveltejs/adapter-auto',

		async adapt(options) {
			for (const candidate of adapters) {
				if (candidate.test()) {
					options.utils.log.info(
						`Detected environment: \u001B[1m\u001B[92m${candidate.name}\u001B[39m\u001B[22m. Using ${candidate.module}`
					);

					let module;

					try {
						module = await import(candidate.module);
					} catch (error) {
						if (
							error.code === 'ERR_MODULE_NOT_FOUND' &&
							error.message.startsWith(`Cannot find package '${candidate.module}'`)
						) {
							throw new Error(
								`It looks like ${candidate.module} is not installed. Please install it and try building your project again.`
							);
						}

						throw error;
					}

					const adapter = module.default();
					return adapter.adapt(options);
				}
			}

			options.utils.log.warn(
				'Could not detect a supported production environment. See https://kit.svelte.dev/docs#adapters to learn how to configure your app to run on the platform of your choosing'
			);
		}
	};
}