/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   time_utils.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: malmarzo <malmarzo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/23 09:15:37 by malmarzo          #+#    #+#             */
/*   Updated: 2025/11/23 11:55:37 by malmarzo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/philo.h"

long long	get_time(void)
{
	struct timeval	tv;

	gettimeofday(&tv, NULL);
	return ((tv.tv_sec * 1000LL) + (tv.tv_usec / 1000));
}

int	is_dead(t_data *data);

void	ft_usleep(long long time_ms_to_sleep, t_data *data)
{
	long long	start;

	start = get_time();
	while (!is_dead(data) && (get_time() - start) < time_ms_to_sleep)
		usleep(100);
}

void	wait_for_start(t_data *data)
{
	while (get_time() < data->start_time)
		usleep(50);
}
