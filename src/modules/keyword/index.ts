import autobind from 'autobind-decorator';
import * as loki from 'lokijs';
import Module from '@/module';
import config from '@/config';
import serifs from '@/serifs';
import { mecab } from './mecab';
import Message from '@/message';
import NeologdNormalizer from 'neologd-normalizer';

function kanaToHira(str: string) {
	return str.replace(/[\u30a1-\u30f6]/g, match => {
		const chr = match.charCodeAt(0) - 0x60;
		return String.fromCharCode(chr);
	});
}

export default class extends Module {
	public readonly name = 'keyword';

	private learnedKeywords: loki.Collection<{
		keyword: string;
		learnedAt: number;
	}>;

	@autobind
	public install() {
		if (!config.keywordEnabled) return {};

		this.learnedKeywords = this.ai.getCollection('_keyword_learnedKeywords', {
			indices: ['userId']
		});

		setInterval(this.learn, 1000 * 60 * (config.keywordInterval || 60));

		return {
			mentionHook: this.mentionHook,
		};
	}

	@autobind
	private async learn() {
		const tl = await this.ai.api('notes/local-timeline', {
			limit: 30
		});

		const interestedNotes = tl.filter(note =>
			note.userId !== this.ai.account.id &&
			note.text != null && note.text.length > 10 &&
			note.cw == null);

		let keywords: string[][] = [];

		for (const note of interestedNotes) {
			let text = note.text;
			if (config.mecabNeologd) {
				text = NeologdNormalizer.normalize(text);
			}

			const tokens = await mecab(text, config.mecab, config.mecabDic);
			if (tokens.length < 3) continue;
			const keywordsInThisNote = tokens.filter(token => token[2] == '固有名詞' && token[8] != null);
			keywords = keywords.concat(keywordsInThisNote);
		}

		if (keywords.length === 0) return;

		const rnd = Math.floor((1 - Math.sqrt(Math.random())) * keywords.length);
		const keyword = keywords.sort((a, b) => a[0].length < b[0].length ? 1 : -1)[rnd];

		const exist = this.learnedKeywords.findOne({
			keyword: keyword[0]
		});

		let text: string;

		if (exist) {
			return;
		} else {
			this.learnedKeywords.insertOne({
				keyword: keyword[0],
				learnedAt: Date.now()
			});

			text = serifs.keyword.learned(keyword[0], kanaToHira(keyword[8]));
		}

		this.ai.post({
			text: text
		});
	}

	@autobind
	private async mentionHook(msg: Message) {
		if (!msg.or(['/learn']) || msg.user.username !== config.master) {
			return false;
		} else {
			this.log('Manualy learn requested');
		}

		this.learn();

		return true;
	}
}
